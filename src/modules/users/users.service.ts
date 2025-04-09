import { Injectable, HttpException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { User } from './domain/models/user.model';
import { ICreateUser, IUpdateUser } from './domain/interfaces/user.interface';
import { UserErrors } from './domain/errors/user-errors';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { ExternalServiceClient } from './infrastructure/http/external-service.client';

/**
 * Servicio de Usuarios
 * 
 * Implementa la lógica de negocio relacionada con los usuarios.
 * Orquesta las operaciones entre repositorios y servicios externos.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly externalServiceClient: ExternalServiceClient,
  ) {}

  /**
   * Obtiene todos los usuarios con paginación
   */
  async findAll(options: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
  }): Promise<PaginatedResult<User>> {
    try {
      return await this.userRepository.findAll({
        page: options.page,
        limit: options.limit,
        filters: {
          isActive: options.isActive,
          search: options.search,
        },
      });
    } catch (error) {
      this.logger.error(`Error al obtener usuarios: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus,
      );
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        throw new HttpException(
          UserErrors.USER_NOT_FOUND,
          UserErrors.USER_NOT_FOUND.httpStatus,
        );
      }
      
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener usuario por ID: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus,
      );
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async create(userData: ICreateUser): Promise<User> {
    try {
      // Validar que el email no exista
      const existingUser = await this.userRepository.findByEmail(userData.email);
      
      if (existingUser) {
        throw new HttpException(
          UserErrors.USER_ALREADY_EXISTS,
          UserErrors.USER_ALREADY_EXISTS.httpStatus,
        );
      }
      
      // Validar formato de email
      if (!this.isValidEmail(userData.email)) {
        throw new HttpException(
          UserErrors.INVALID_EMAIL,
          UserErrors.INVALID_EMAIL.httpStatus,
        );
      }
      
      // Validar contraseña
      if (!this.isValidPassword(userData.password)) {
        throw new HttpException(
          UserErrors.INVALID_PASSWORD,
          UserErrors.INVALID_PASSWORD.httpStatus,
        );
      }
      
      // Hashear contraseña
      const hashedPassword = await this.hashPassword(userData.password);
      
      // Crear usuario
      const user = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      
      // Notificar a servicio externo (simulado)
      try {
        await this.externalServiceClient.notifyUserCreation(user.id);
      } catch (externalError) {
        this.logger.warn(`No se pudo notificar al servicio externo: ${externalError.message}`);
        // No fallamos el flujo principal si el servicio externo falla
      }
      
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear usuario: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus,
      );
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: string, userData: IUpdateUser): Promise<User> {
    try {
      // Verificar que el usuario existe
      const existingUser = await this.userRepository.findById(id);
      
      if (!existingUser) {
        throw new HttpException(
          UserErrors.USER_NOT_FOUND,
          UserErrors.USER_NOT_FOUND.httpStatus,
        );
      }
      
      // Validar email si se proporciona
      if (userData.email && !this.isValidEmail(userData.email)) {
        throw new HttpException(
          UserErrors.INVALID_EMAIL,
          UserErrors.INVALID_EMAIL.httpStatus,
        );
      }
      
      // Verificar que el email no esté en uso por otro usuario
      if (userData.email && userData.email !== existingUser.email) {
        const userWithEmail = await this.userRepository.findByEmail(userData.email);
        if (userWithEmail && userWithEmail.id !== id) {
          throw new HttpException(
            UserErrors.USER_ALREADY_EXISTS,
            UserErrors.USER_ALREADY_EXISTS.httpStatus,
          );
        }
      }
      
      // Validar y hashear contraseña si se proporciona
      let hashedPassword: string | undefined;
      if (userData.password) {
        if (!this.isValidPassword(userData.password)) {
          throw new HttpException(
            UserErrors.INVALID_PASSWORD,
            UserErrors.INVALID_PASSWORD.httpStatus,
          );
        }
        hashedPassword = await this.hashPassword(userData.password);
      }
      
      // Actualizar usuario
      const updatedUser = await this.userRepository.update(id, {
        ...userData,
        ...(hashedPassword && { password: hashedPassword }),
      });
      
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar usuario: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus,
      );
    }
  }

  /**
   * Elimina un usuario (borrado lógico)
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Verificar que el usuario existe
      const existingUser = await this.userRepository.findById(id);
      
      if (!existingUser) {
        throw new HttpException(
          UserErrors.USER_NOT_FOUND,
          UserErrors.USER_NOT_FOUND.httpStatus,
        );
      }
      
      // Realizar borrado lógico
      const result = await this.userRepository.delete(id);
      
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar usuario: ${error.message}`, error.stack);
      throw new HttpException(
        UserErrors.DATABASE_ERROR,
        UserErrors.DATABASE_ERROR.httpStatus,
      );
    }
  }

  /**
   * Métodos privados de validación y utilidad
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}