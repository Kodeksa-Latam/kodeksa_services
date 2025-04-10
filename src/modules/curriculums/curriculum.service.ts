import { Injectable, HttpException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurriculumEntity } from './curriculum.entity';
import { CreateCurriculumDto, UpdateCurriculumDto, CurriculumResponseDto } from './curriculum.dto';
import { UserService } from '../users/user.service';
import { CurriculumErrors } from './errors/curriculum-errors';

/**
 * Servicio de Currículums
 * 
 * Implementa la lógica de negocio relacionada con los currículums.
 */
@Injectable()
export class CurriculumService {
  private readonly logger = new Logger(CurriculumService.name);

  constructor(
    @InjectRepository(CurriculumEntity)
    private readonly curriculumRepository: Repository<CurriculumEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  /**
   * Obtiene un currículum por su ID
   */
  async findById(id: string): Promise<CurriculumResponseDto> {
    try {
      const curriculum = await this.curriculumRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!curriculum) {
        throw new HttpException(
          CurriculumErrors.CURRICULUM_NOT_FOUND,
          CurriculumErrors.CURRICULUM_NOT_FOUND.httpStatus
        );
      }
      
      return new CurriculumResponseDto(curriculum);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener currículum por ID: ${error.message}`, error.stack);
      throw new HttpException(
        CurriculumErrors.DATABASE_ERROR,
        CurriculumErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene un currículum por el ID del usuario
   * @param userId ID del usuario
   * @param checkUserExists Si es true, verifica que el usuario exista (por defecto true)
   */
  async findByUserId(userId: string, checkUserExists: boolean = true): Promise<CurriculumResponseDto> {
    try {
      // Verificar que el usuario existe, pero solo si se solicita
      if (checkUserExists) {
        try {
          // Llamar a findById con loadCurriculum=false para evitar ciclos
          await this.userService.findById(userId, { loadCardConfig: false, loadCurriculum: false });
        } catch (error) {
          // Si es un error diferente al de usuario no encontrado, lo propagamos
          if (!(error instanceof HttpException)) {
            throw error;
          }
          throw new HttpException(
            CurriculumErrors.USER_NOT_FOUND,
            CurriculumErrors.USER_NOT_FOUND.httpStatus
          );
        }
      }
      
      const curriculum = await this.curriculumRepository.findOne({
        where: { userId },
        relations: ['user'],
      });
      
      if (!curriculum) {
        throw new HttpException(
          CurriculumErrors.CURRICULUM_NOT_FOUND,
          CurriculumErrors.CURRICULUM_NOT_FOUND.httpStatus
        );
      }
      
      return new CurriculumResponseDto(curriculum);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener currículum por ID de usuario: ${error.message}`, error.stack);
      throw new HttpException(
        CurriculumErrors.DATABASE_ERROR,
        CurriculumErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea un nuevo currículum
   * @param createDto Datos del currículum
   * @param skipUserCheck Si es true, no verifica la existencia del usuario (usado para evitar ciclos)
   */
  async create(createDto: CreateCurriculumDto, skipUserCheck: boolean = false): Promise<CurriculumResponseDto> {
    try {
      this.logger.log(`Iniciando creación de currículum para usuario ${createDto.userId}, skipUserCheck=${skipUserCheck}`);
      
      // Verificar que el usuario existe, pero solo si no estamos saltando la verificación
      if (!skipUserCheck) {
        this.logger.log(`Verificando existencia del usuario ${createDto.userId}`);
        try {
          // El parámetro loadCurriculum: false es crucial - evita que findById cargue el currículum
          await this.userService.findById(createDto.userId, { loadCardConfig: false, loadCurriculum: false });
          this.logger.log(`Usuario ${createDto.userId} encontrado correctamente`);
        } catch (error) {
          this.logger.error(`Error al verificar usuario: ${error.message}`);
          // Si es un error diferente al de usuario no encontrado, lo propagamos
          if (!(error instanceof HttpException)) {
            throw error;
          }
          throw new HttpException(
            CurriculumErrors.USER_NOT_FOUND,
            CurriculumErrors.USER_NOT_FOUND.httpStatus
          );
        }
      } else {
        this.logger.log(`Saltando verificación de usuario para ${createDto.userId}`);
      }
      
      // Verificar que el usuario no tenga ya un currículum
      this.logger.log(`Verificando si el usuario ${createDto.userId} ya tiene un currículum`);
      const existingCurriculum = await this.curriculumRepository.findOne({
        where: { userId: createDto.userId }
      });
      
      if (existingCurriculum) {
        this.logger.log(`El usuario ${createDto.userId} ya tiene un currículum`);
        throw new HttpException(
          CurriculumErrors.CURRICULUM_ALREADY_EXISTS,
          CurriculumErrors.CURRICULUM_ALREADY_EXISTS.httpStatus
        );
      }
      
      // Crear currículum
      this.logger.log(`Creando currículum en la base de datos para el usuario ${createDto.userId}`);
      const newCurriculum = this.curriculumRepository.create(createDto);
      const savedCurriculum = await this.curriculumRepository.save(newCurriculum);
      this.logger.log(`Currículum creado con éxito para el usuario ${createDto.userId}, id=${savedCurriculum.id}`);
      
      return new CurriculumResponseDto(savedCurriculum);
    } catch (error) {
      this.logger.error(`Error en create: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear currículum: ${error.message}`, error.stack);
      throw new HttpException(
        CurriculumErrors.DATABASE_ERROR,
        CurriculumErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza un currículum existente
   */
  async update(id: string, updateDto: UpdateCurriculumDto): Promise<CurriculumResponseDto> {
    try {
      // Verificar que el currículum existe
      const existingCurriculum = await this.curriculumRepository.findOne({
        where: { id }
      });
      
      if (!existingCurriculum) {
        throw new HttpException(
          CurriculumErrors.CURRICULUM_NOT_FOUND,
          CurriculumErrors.CURRICULUM_NOT_FOUND.httpStatus
        );
      }
      
      // Verificar que el usuario existe si se está cambiando
      if (updateDto.userId && updateDto.userId !== existingCurriculum.userId) {
        try {
          await this.userService.findById(updateDto.userId, { loadCardConfig: false, loadCurriculum: false });
        } catch (error) {
          if (!(error instanceof HttpException)) {
            throw error;
          }
          throw new HttpException(
            CurriculumErrors.USER_NOT_FOUND,
            CurriculumErrors.USER_NOT_FOUND.httpStatus
          );
        }
      }
      
      // Actualizar currículum
      await this.curriculumRepository.update(id, updateDto);
      
      // Obtener el currículum actualizado
      const updatedCurriculum = await this.curriculumRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!updatedCurriculum) {
        throw new HttpException(
          CurriculumErrors.CURRICULUM_NOT_FOUND,
          CurriculumErrors.CURRICULUM_NOT_FOUND.httpStatus
        );
      }
      
      return new CurriculumResponseDto(updatedCurriculum);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar currículum: ${error.message}`, error.stack);
      throw new HttpException(
        CurriculumErrors.DATABASE_ERROR,
        CurriculumErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Elimina un currículum
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Verificar que el currículum existe
      const existingCurriculum = await this.curriculumRepository.findOne({
        where: { id }
      });
      
      if (!existingCurriculum) {
        throw new HttpException(
          CurriculumErrors.CURRICULUM_NOT_FOUND,
          CurriculumErrors.CURRICULUM_NOT_FOUND.httpStatus
        );
      }
      
      // Eliminar currículum
      await this.curriculumRepository.delete(id);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar currículum: ${error.message}`, error.stack);
      throw new HttpException(
        CurriculumErrors.DATABASE_ERROR,
        CurriculumErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea o actualiza un currículum para un usuario
   * Si el usuario ya tiene un currículum, lo actualiza
   * Si no tiene, crea uno nuevo
   */
  async createOrUpdate(createDto: CreateCurriculumDto): Promise<CurriculumResponseDto> {
    try {
      // Verificar si ya existe un currículum para este usuario
      const existingCurriculum = await this.curriculumRepository.findOne({
        where: { userId: createDto.userId }
      });
      
      if (existingCurriculum) {
        // Si existe, actualizar
        return this.update(existingCurriculum.id, createDto);
      } else {
        // Si no existe, crear nuevo
        return this.create(createDto);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear o actualizar currículum: ${error.message}`, error.stack);
      throw new HttpException(
        CurriculumErrors.DATABASE_ERROR,
        CurriculumErrors.DATABASE_ERROR.httpStatus
      );
    }
  }
}