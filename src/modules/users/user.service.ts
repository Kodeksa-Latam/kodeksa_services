import { Injectable, HttpException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { CardConfigurationService } from '../card-configurations/card-configuration.service';
import { UserErrors } from './errors/user-errors';
import { CurriculumService } from '../curriculums/curriculum.service';

/**
 * Servicio de Usuarios
 * 
 * Implementa la lógica de negocio relacionada con los usuarios.
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => CardConfigurationService))
    private readonly cardConfigService: CardConfigurationService,
    @Inject(forwardRef(() => CurriculumService))
    private readonly curriculumService: CurriculumService
  ) {}

  /**
   * Obtiene todos los usuarios con paginación
   */
  async findAll(options: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
  }): Promise<PaginatedResult<UserResponseDto>> {
    try {
      const { page = 1, limit = 10, isActive, search } = options;
      const skip = (page - 1) * limit;
      
      // Construir las condiciones de búsqueda
      const where: FindOptionsWhere<UserEntity> = {};
      
      if (isActive !== undefined) {
        where.isActive = isActive;
      }
      
      if (search) {
        where.email = Like(`%${search}%`);
      }
      
      // Obtener usuarios y contar total
      const [users, totalItems] = await this.userRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: 'ASC' },
        relations: ['cardConfiguration'],
      });
      
      const items = users.map(user => {
        const userDto = new UserResponseDto(user);
        return userDto;
      });
      
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
      this.logger.error(`Error al obtener usuarios: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus
      );
    }
  }


  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @param options Opciones para cargar relaciones
   */
  async findById(id: string, options: {
    loadCardConfig?: boolean;
    loadCurriculum?: boolean;
  } = {
    loadCardConfig: true,
    loadCurriculum: true
  }): Promise<UserResponseDto> {
    try {
      const relations:string[] = [];
      
      if (options.loadCardConfig) {
        relations.push('cardConfiguration');
      }
      
      if (options.loadCurriculum) {
        relations.push('curriculum');
      }
      
      const user = await this.userRepository.findOne({
        where: { id },
        relations,
      });
      
      if (!user) {
        throw new HttpException(
          UserErrors.USER_NOT_FOUND,
          UserErrors.USER_NOT_FOUND.httpStatus
        );
      }
      
      return new UserResponseDto(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener usuario por ID: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene un usuario por su slug
   */
  async findBySlug(slug: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { slug },
        relations: ['cardConfiguration', 'curriculum'],
      });
      
      if (!user) {
        throw new HttpException(
          UserErrors.USER_SLUG_NOT_FOUND,
          UserErrors.USER_SLUG_NOT_FOUND.httpStatus
        );
      }
      
      return new UserResponseDto(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener usuario por slug: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene un usuario por su email
   */
  async findByEmail(email: string, loadCardConfig: boolean = true): Promise<UserResponseDto | null> {
    try {
      const relations = loadCardConfig ? ['cardConfiguration'] : [];
      
      const user = await this.userRepository.findOne({
        where: { email },
        relations,
      });
      
      if (!user) {
        return null;
      }
      
      return new UserResponseDto(user);
    } catch (error) {
      this.logger.error(`Error al obtener usuario por email: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea las configuraciones por defecto para un usuario
   * @param userId ID del usuario para el que se crearán las configuraciones
   */
  private async createDefaultUserConfigurations(userId: string): Promise<void> {
    try {
      this.logger.log(`Creando configuraciones por defecto para el usuario ${userId}`);
      
      // 1. Crear configuración de tarjeta
      await this.createDefaultCardConfiguration(userId);

      // 2. Crear Curriculum
      await this.createDefaultCurriculum(userId);
      
      // Aquí se pueden añadir más configuraciones por defecto en el futuro
      // Por ejemplo: curriculum, experiencias, etc.
      
      this.logger.log(`Configuraciones por defecto creadas con éxito para el usuario ${userId}`);
    } catch (error) {
      this.logger.error(`Error al crear configuraciones por defecto: ${error.message}`, error.stack);
      throw error; // Propagamos el error para que sea manejado por la función que llama
    }
  }
  
  /**
   * Crea una configuración de tarjeta por defecto para un usuario
   * @param userId ID del usuario para el que se creará la configuración
   */
  private async createDefaultCardConfiguration(userId: string): Promise<void> {
    try {
      this.logger.log(`Creando configuración de tarjeta por defecto para el usuario ${userId}`);
      
      // Usamos skipUserCheck=true para evitar el ciclo de dependencia
      await this.cardConfigService.create({
        userId: userId,
        // Valores por defecto para la configuración de tarjeta
        imageSize: 90,
        bgColor: '#FFFFFF',
        textAbove: '',
        textAboveColor: '#000000',
        aboveFontFamily: "'Clash Display', sans-serif",
        aboveFontSize: '3.5rem',
        aboveFontWeight: '700',
        aboveLetterSpacing: '0.23em',
        aboveTextTransform: 'uppercase',
        aboveTextTopOffset: '0px',
        textBelow: '',
        belowFontWeight: '700',
        belowLetterSpacing: '0.35em',
        belowFontFamily: "'Clash Display', sans-serif",
        belowFontSize:'1.5rem',
        belowTextTransform: 'uppercase',
        textBelowColor: '#000000',
      }, true);
      
      this.logger.log(`Configuración de tarjeta creada con éxito para el usuario ${userId}`);
    } catch (error) {
      this.logger.error(`Error al crear configuración de tarjeta: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario con su propio curriculum
   */
  private async createDefaultCurriculum(userId:string): Promise<void> {
    this.logger.log(`Creando curriculum por defecto para el usuario ${userId}`);
    await this.curriculumService.create({
       userId:userId,
    },true);
    
  }

  /**
   * Crea un nuevo usuario con todas sus configuraciones por defecto
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      this.logger.log('Iniciando creación de usuario');
      
      // Validar que el email no exista
      this.logger.log(`Verificando si ya existe un usuario con el email: ${createUserDto.email}`);
      const existingUser = await this.findByEmail(createUserDto.email, false);
      
      if (existingUser) {
        this.logger.log('Email ya registrado');
        throw new HttpException(
          UserErrors.USER_ALREADY_EXISTS,
          UserErrors.USER_ALREADY_EXISTS.httpStatus
        );
      }
      
      // Hashear contraseña
      // this.logger.log('Hasheando contraseña');
      // const hashedPassword = await this.hashPassword(createUserDto.password);
      
      // Si no se proporcionó un slug, generarlo a partir del nombre y apellido
      if (!createUserDto.slug) {
        createUserDto.slug = this.generateSlug(`${createUserDto.firstName} ${createUserDto.lastName}`);
      }
      
      // Crear usuario
      this.logger.log('Guardando usuario en la base de datos');
      const newUser = this.userRepository.create({
        ...createUserDto,
        // password: hashedPassword,
      });
      
      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`Usuario creado con ID: ${savedUser.id}`);
      
      try {
        // Crear todas las configuraciones por defecto
        await this.createDefaultUserConfigurations(savedUser.id);
      } catch (configError) {
        this.logger.warn(`Error al crear configuraciones por defecto: ${configError.message}`, configError.stack);
        // No fallamos la creación del usuario si falla la creación de configuraciones
      }
      
      // Recuperamos el usuario completo con sus relaciones
      const userWithRelations = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['cardConfiguration'],
      });
      
      if (!userWithRelations) {
        // Si por alguna razón no encontramos el usuario recién creado, usamos el que teníamos antes
        return new UserResponseDto(savedUser);
      }
      
      return new UserResponseDto(userWithRelations);
    } catch (error) {
      this.logger.error(`Error en create: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear usuario: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza un usuario existente (solo datos del usuario, no relaciones)
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      // Verificar que el usuario existe
      const existingUser = await this.userRepository.findOne({
        where: { id }
      });

      if (!existingUser) {
        throw new HttpException(
          UserErrors.USER_NOT_FOUND,
          UserErrors.USER_NOT_FOUND.httpStatus
        );
      }

      // Verificar que el email no esté en uso por otro usuario
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        const userWithEmail = await this.userRepository.findOne({
          where: { email: updateUserDto.email }
        });
        
        if (userWithEmail && userWithEmail.id !== id) {
          throw new HttpException(
            UserErrors.USER_ALREADY_EXISTS,
            UserErrors.USER_ALREADY_EXISTS.httpStatus
          );
        }
      }

      // Hashear contraseña si se proporciona
      let updateData = { ...updateUserDto };
      // if (updateUserDto.password) {
      //   updateData.password = await this.hashPassword(updateUserDto.password);
      // }

      // Actualizar solo los datos del usuario, no sus relaciones
      await this.userRepository.update(id, updateData);
      
      // Obtener el usuario actualizado con sus relaciones
      const updatedUser = await this.userRepository.findOne({
        where: { id },
        relations: ['cardConfiguration'],
      });

      if (!updatedUser) {
        throw new HttpException(
          UserErrors.USER_NOT_FOUND,
          UserErrors.USER_NOT_FOUND.httpStatus
        );
      }

      return new UserResponseDto(updatedUser);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error al actualizar usuario: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Elimina un usuario (borrado lógico)
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Verificar que el usuario existe
      const existingUser = await this.userRepository.findOne({
        where: { id }
      });

      if (!existingUser) {
        throw new HttpException(
          UserErrors.USER_NOT_FOUND,
          UserErrors.USER_NOT_FOUND.httpStatus
        );
      }

      // Realizar borrado lógico
      await this.userRepository.update(id, { isActive: false });
      
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error al eliminar usuario: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Métodos privados y utilidades
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  
  private generateSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // Reemplaza espacios con guiones
      .replace(/[^\w\-]+/g, '')   // Elimina caracteres no permitidos
      .replace(/\-\-+/g, '-')     // Reemplaza múltiples guiones con uno solo
      .replace(/^-+/, '')         // Elimina guiones al inicio
      .replace(/-+$/, '');        // Elimina guiones al final
  }
}