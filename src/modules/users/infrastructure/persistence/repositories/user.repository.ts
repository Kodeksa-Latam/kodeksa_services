import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../../domain/models/user.model';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { ICreateUser, IUpdateUser } from '../../../domain/interfaces/user.interface';
import { PaginatedResult } from '../../../../../common/dto/pagination.dto';

/**
 * Repositorio de Usuarios
 * 
 * Implementa la interfaz IUserRepository para interactuar con la base de datos.
 * Usa TypeORM para las operaciones de persistencia.
 */
@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Mapea una entidad de usuario a un modelo de dominio
   */
  private mapEntityToModel(entity: UserEntity): User {
    return new User({
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      password: entity.password,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Encuentra todos los usuarios con paginación
   */
  async findAll(options: {
    page: number;
    limit: number;
    filters?: {
      isActive?: boolean;
      search?: string;
    };
  }): Promise<PaginatedResult<User>> {
    try {
      const { page = 1, limit = 10, filters = {} } = options;
      const skip = (page - 1) * limit;
      
      // Construir las condiciones de búsqueda
      const where: FindOptionsWhere<UserEntity> = {};
      
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      
      if (filters.search) {
        where.email = Like(`%${filters.search}%`);
        // Nota: TypeORM no soporta OR directamente en el objeto where,
        // para búsquedas más complejas, se debería usar QueryBuilder
      }
      
      // Obtener usuarios y contar total
      const [entities, totalItems] = await this.userRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      
      // Mapear a modelos de dominio
      const items = entities.map(entity => this.mapEntityToModel(entity));
      
      // Calcular metadatos de paginación
      const totalPages = Math.ceil(totalItems / limit);
      
      return {
        items,
        meta: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(`Error en findAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Encuentra un usuario por su ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const entity = await this.userRepository.findOne({
        where: { id },
      });
      
      if (!entity) {
        return null;
      }
      
      return this.mapEntityToModel(entity);
    } catch (error) {
      this.logger.error(`Error en findById: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Encuentra un usuario por su email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const entity = await this.userRepository.findOne({
        where: { email },
      });
      
      if (!entity) {
        return null;
      }
      
      return this.mapEntityToModel(entity);
    } catch (error) {
      this.logger.error(`Error en findByEmail: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async create(userData: ICreateUser): Promise<User> {
    try {
      const newEntity = this.userRepository.create({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
      });
      
      const savedEntity = await this.userRepository.save(newEntity);
      return this.mapEntityToModel(savedEntity);
    } catch (error) {
      this.logger.error(`Error en create: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: string, userData: IUpdateUser): Promise<User> {
    try {
      await this.userRepository.update(id, userData);
      
      const updatedEntity = await this.userRepository.findOne({
        where: { id },
      });
      
      if (!updatedEntity) {
        throw new Error(`Usuario con id ${id} no encontrado después de actualizar`);
      }
      
      return this.mapEntityToModel(updatedEntity);
    } catch (error) {
      this.logger.error(`Error en update: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Elimina un usuario (borrado lógico)
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Borrado lógico: desactivar el usuario
      await this.userRepository.update(id, { isActive: false });
      return true;
      
      // Borrado físico (alternativo)
      // const result = await this.userRepository.delete(id);
      // return result.affected > 0;
    } catch (error) {
      this.logger.error(`Error en delete: ${error.message}`, error.stack);
      throw error;
    }
  }
}