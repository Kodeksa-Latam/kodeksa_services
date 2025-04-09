import { Injectable, HttpException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardConfigurationEntity } from './card-configuration.entity';
import { CreateCardConfigurationDto, UpdateCardConfigurationDto, CardConfigurationResponseDto } from './card-configuration.dto';
import { UserService } from '../users/user.service';
import { CardConfigurationErrors } from './errors/card-configuration-errors';

/**
 * Servicio de Configuraciones de Tarjeta
 * 
 * Implementa la lógica de negocio relacionada con las configuraciones de tarjeta.
 */
@Injectable()
export class CardConfigurationService {
  private readonly logger = new Logger(CardConfigurationService.name);

  constructor(
    @InjectRepository(CardConfigurationEntity)
    private readonly cardConfigRepository: Repository<CardConfigurationEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  /**
   * Obtiene una configuración de tarjeta por su ID
   */
  async findById(id: string): Promise<CardConfigurationResponseDto> {
    try {
      const config = await this.cardConfigRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!config) {
        throw new HttpException(
          CardConfigurationErrors.CONFIG_NOT_FOUND,
          CardConfigurationErrors.CONFIG_NOT_FOUND.httpStatus
        );
      }
      
      return new CardConfigurationResponseDto(config);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener configuración por ID: ${error.message}`, error.stack);
      throw new HttpException(
        CardConfigurationErrors.DATABASE_ERROR,
        CardConfigurationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene una configuración de tarjeta por el ID del usuario
   * @param userId ID del usuario
   * @param checkUserExists Si es true, verifica que el usuario exista (por defecto true)
   */
  async findByUserId(userId: string, checkUserExists: boolean = true): Promise<CardConfigurationResponseDto> {
    try {
      // Verificar que el usuario existe, pero solo si se solicita
      if (checkUserExists) {
        try {
          // Llamar a findById con loadCardConfig=false para evitar ciclos
          await this.userService.findById(userId, false);
        } catch (error) {
          // Si es un error diferente al de usuario no encontrado, lo propagamos
          if (!(error instanceof HttpException)) {
            throw error;
          }
          throw new HttpException(
            CardConfigurationErrors.USER_NOT_FOUND,
            CardConfigurationErrors.USER_NOT_FOUND.httpStatus
          );
        }
      }
      
      const config = await this.cardConfigRepository.findOne({
        where: { userId },
        relations: ['user'],
      });
      
      if (!config) {
        throw new HttpException(
          CardConfigurationErrors.CONFIG_NOT_FOUND,
          CardConfigurationErrors.CONFIG_NOT_FOUND.httpStatus
        );
      }
      
      return new CardConfigurationResponseDto(config);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener configuración por ID de usuario: ${error.message}`, error.stack);
      throw new HttpException(
        CardConfigurationErrors.DATABASE_ERROR,
        CardConfigurationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea una nueva configuración de tarjeta
   * @param createDto Datos de la configuración
   * @param skipUserCheck Si es true, no verifica la existencia del usuario (usado para evitar ciclos)
   */
  async create(createDto: CreateCardConfigurationDto, skipUserCheck: boolean = false): Promise<CardConfigurationResponseDto> {
    try {
      this.logger.log(`Iniciando creación de configuración para usuario ${createDto.userId}, skipUserCheck=${skipUserCheck}`);
      
      // Verificar que el usuario existe, pero solo si no estamos saltando la verificación
      if (!skipUserCheck) {
        this.logger.log(`Verificando existencia del usuario ${createDto.userId}`);
        try {
          // El parámetro false es crucial - evita que findById cargue la configuración de tarjeta
          await this.userService.findById(createDto.userId, false);
          this.logger.log(`Usuario ${createDto.userId} encontrado correctamente`);
        } catch (error) {
          this.logger.error(`Error al verificar usuario: ${error.message}`);
          // Si es un error diferente al de usuario no encontrado, lo propagamos
          if (!(error instanceof HttpException)) {
            throw error;
          }
          throw new HttpException(
            CardConfigurationErrors.USER_NOT_FOUND,
            CardConfigurationErrors.USER_NOT_FOUND.httpStatus
          );
        }
      } else {
        this.logger.log(`Saltando verificación de usuario para ${createDto.userId}`);
      }
      
      // Verificar que el usuario no tenga ya una configuración
      this.logger.log(`Verificando si el usuario ${createDto.userId} ya tiene una configuración`);
      const existingConfig = await this.cardConfigRepository.findOne({
        where: { userId: createDto.userId }
      });
      
      if (existingConfig) {
        this.logger.log(`El usuario ${createDto.userId} ya tiene una configuración`);
        throw new HttpException(
          CardConfigurationErrors.CONFIG_ALREADY_EXISTS,
          CardConfigurationErrors.CONFIG_ALREADY_EXISTS.httpStatus
        );
      }
      
      // Crear configuración
      this.logger.log(`Creando configuración en la base de datos para el usuario ${createDto.userId}`);
      const newConfig = this.cardConfigRepository.create(createDto);
      const savedConfig = await this.cardConfigRepository.save(newConfig);
      this.logger.log(`Configuración creada con éxito para el usuario ${createDto.userId}, id=${savedConfig.id}`);
      
      return new CardConfigurationResponseDto(savedConfig);
    } catch (error) {
      this.logger.error(`Error en create: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear configuración: ${error.message}`, error.stack);
      throw new HttpException(
        CardConfigurationErrors.DATABASE_ERROR,
        CardConfigurationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza una configuración de tarjeta existente
   */
  async update(id: string, updateDto: UpdateCardConfigurationDto): Promise<CardConfigurationResponseDto> {
    try {
      // Verificar que la configuración existe
      const existingConfig = await this.cardConfigRepository.findOne({
        where: { id }
      });
      
      if (!existingConfig) {
        throw new HttpException(
          CardConfigurationErrors.CONFIG_NOT_FOUND,
          CardConfigurationErrors.CONFIG_NOT_FOUND.httpStatus
        );
      }
      
      // Actualizar configuración
      await this.cardConfigRepository.update(id, updateDto);
      
      // Obtener la configuración actualizada
      const updatedConfig = await this.cardConfigRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!updatedConfig) {
        throw new HttpException(
          CardConfigurationErrors.CONFIG_NOT_FOUND,
          CardConfigurationErrors.CONFIG_NOT_FOUND.httpStatus
        );
      }
      
      return new CardConfigurationResponseDto(updatedConfig);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar configuración: ${error.message}`, error.stack);
      throw new HttpException(
        CardConfigurationErrors.DATABASE_ERROR,
        CardConfigurationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Elimina una configuración de tarjeta
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Verificar que la configuración existe
      const existingConfig = await this.cardConfigRepository.findOne({
        where: { id }
      });
      
      if (!existingConfig) {
        throw new HttpException(
          CardConfigurationErrors.CONFIG_NOT_FOUND,
          CardConfigurationErrors.CONFIG_NOT_FOUND.httpStatus
        );
      }
      
      // Eliminar configuración
      await this.cardConfigRepository.delete(id);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar configuración: ${error.message}`, error.stack);
      throw new HttpException(
        CardConfigurationErrors.DATABASE_ERROR,
        CardConfigurationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Restablece una configuración de tarjeta a los valores predeterminados
   */
  async reset(id: string): Promise<CardConfigurationResponseDto> {
    try {
      // Verificar que la configuración existe
      const existingConfig = await this.cardConfigRepository.findOne({
        where: { id }
      });
      
      if (!existingConfig) {
        throw new HttpException(
          CardConfigurationErrors.CONFIG_NOT_FOUND,
          CardConfigurationErrors.CONFIG_NOT_FOUND.httpStatus
        );
      }
      
      // Restablecer los valores a los predeterminados
      const defaultValues: UpdateCardConfigurationDto = {
        imageSize: 90,
        bgColor: '#FFFFFF',
        textAbove: '',
        textAboveColor: '#000000',
        aboveFontFamily: 'Arial',
        aboveFontSize: '16px',
        aboveFontWeight: 'normal',
        aboveLetterSpacing: 'normal',
        aboveTextTransform: 'none',
        aboveTextTopOffset: '0px',
        textBelow: '',
        belowFontWeight: 'normal',
        belowLetterSpacing: 'normal',
        belowFontFamily: 'Arial',
        belowTextTransform: 'none',
        textBelowColor: '#000000',
      };
      
      // Actualizar con los valores predeterminados
      await this.cardConfigRepository.update(id, defaultValues);
      
      // Obtener la configuración actualizada
      const updatedConfig = await this.cardConfigRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!updatedConfig) {
        throw new HttpException(
          CardConfigurationErrors.CONFIG_NOT_FOUND,
          CardConfigurationErrors.CONFIG_NOT_FOUND.httpStatus
        );
      }
      
      return new CardConfigurationResponseDto(updatedConfig);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al restablecer configuración: ${error.message}`, error.stack);
      throw new HttpException(
        CardConfigurationErrors.DATABASE_ERROR,
        CardConfigurationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }
}