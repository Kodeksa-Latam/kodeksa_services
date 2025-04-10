import { Injectable, HttpException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkExperienceEntity } from './work-experience.entity';
import { CreateWorkExperienceDto, UpdateWorkExperienceDto, WorkExperienceResponseDto } from './work-experience.dto';
import { UserService } from '../users/user.service';
import { WorkExperienceErrors } from './errors/work-experience-errors';

/**
 * Servicio de Experiencias Laborales
 * 
 * Implementa la lógica de negocio relacionada con las experiencias laborales de los usuarios.
 */
@Injectable()
export class WorkExperienceService {
  private readonly logger = new Logger(WorkExperienceService.name);

  constructor(
    @InjectRepository(WorkExperienceEntity)
    private readonly workExperienceRepository: Repository<WorkExperienceEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  /**
   * Obtiene todas las experiencias laborales
   */
  async findAll(): Promise<WorkExperienceResponseDto[]> {
    try {
      const workExperiences = await this.workExperienceRepository.find({
        relations: ['user'],
        order: { fromYear: 'DESC' },
      });
      
      return workExperiences.map(exp => new WorkExperienceResponseDto(exp));
    } catch (error) {
      this.logger.error(`Error al obtener todas las experiencias laborales: ${error.message}`, error.stack);
      throw new HttpException(
        WorkExperienceErrors.DATABASE_ERROR,
        WorkExperienceErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene una experiencia laboral por su ID
   */
  async findById(id: string): Promise<WorkExperienceResponseDto> {
    try {
      const workExperience = await this.workExperienceRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!workExperience) {
        throw new HttpException(
          WorkExperienceErrors.WORK_EXPERIENCE_NOT_FOUND,
          WorkExperienceErrors.WORK_EXPERIENCE_NOT_FOUND.httpStatus
        );
      }
      
      return new WorkExperienceResponseDto(workExperience);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener experiencia laboral por ID: ${error.message}`, error.stack);
      throw new HttpException(
        WorkExperienceErrors.DATABASE_ERROR,
        WorkExperienceErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene todas las experiencias laborales de un usuario por su ID
   */
  async findByUserId(userId: string): Promise<WorkExperienceResponseDto[]> {
    try {
      // Verificar que el usuario existe
      try {
        await this.userService.findById(userId);
      } catch (error) {
        if (error instanceof HttpException) {
          throw new HttpException(
            WorkExperienceErrors.USER_NOT_FOUND,
            WorkExperienceErrors.USER_NOT_FOUND.httpStatus
          );
        }
        throw error;
      }
      
      const workExperiences = await this.workExperienceRepository.find({
        where: { userId },
        relations: ['user'],
        order: { fromYear: 'DESC' },
      });
      
      return workExperiences.map(exp => new WorkExperienceResponseDto(exp));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener experiencias laborales por ID de usuario: ${error.message}`, error.stack);
      throw new HttpException(
        WorkExperienceErrors.DATABASE_ERROR,
        WorkExperienceErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea una nueva experiencia laboral
   */
  async create(createDto: CreateWorkExperienceDto): Promise<WorkExperienceResponseDto> {
    try {
      // Verificar que el usuario existe
      try {
        await this.userService.findById(createDto.userId);
      } catch (error) {
        if (error instanceof HttpException) {
          throw new HttpException(
            WorkExperienceErrors.USER_NOT_FOUND,
            WorkExperienceErrors.USER_NOT_FOUND.httpStatus
          );
        }
        throw error;
      }
      
      // Validar que la fecha de fin no sea anterior a la fecha de inicio
      if (createDto.untilYear && new Date(createDto.untilYear) < new Date(createDto.fromYear)) {
        throw new HttpException(
          WorkExperienceErrors.UNTIL_BEFORE_FROM,
          WorkExperienceErrors.UNTIL_BEFORE_FROM.httpStatus
        );
      }
      
      // Crear experiencia laboral
      const newWorkExperience = this.workExperienceRepository.create(createDto);
      const savedWorkExperience = await this.workExperienceRepository.save(newWorkExperience);
      
      return new WorkExperienceResponseDto(savedWorkExperience);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear experiencia laboral: ${error.message}`, error.stack);
      throw new HttpException(
        WorkExperienceErrors.DATABASE_ERROR,
        WorkExperienceErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza una experiencia laboral existente
   */
  async update(id: string, updateDto: UpdateWorkExperienceDto): Promise<WorkExperienceResponseDto> {
    try {
      // Verificar que la experiencia laboral existe
      const existingWorkExperience = await this.workExperienceRepository.findOne({
        where: { id }
      });
      
      if (!existingWorkExperience) {
        throw new HttpException(
          WorkExperienceErrors.WORK_EXPERIENCE_NOT_FOUND,
          WorkExperienceErrors.WORK_EXPERIENCE_NOT_FOUND.httpStatus
        );
      }
      
      // Si se cambia el usuario, verificar que existe
      if (updateDto.userId && updateDto.userId !== existingWorkExperience.userId) {
        try {
          await this.userService.findById(updateDto.userId);
        } catch (error) {
          if (error instanceof HttpException) {
            throw new HttpException(
              WorkExperienceErrors.USER_NOT_FOUND,
              WorkExperienceErrors.USER_NOT_FOUND.httpStatus
            );
          }
          throw error;
        }
      }
      
      // Validar fechas si se proporcionan ambas
      const fromYear = updateDto.fromYear ? new Date(updateDto.fromYear) : existingWorkExperience.fromYear;
      const untilYear = updateDto.untilYear ? new Date(updateDto.untilYear) : existingWorkExperience.untilYear;
      
      if (untilYear && fromYear && untilYear < fromYear) {
        throw new HttpException(
          WorkExperienceErrors.UNTIL_BEFORE_FROM,
          WorkExperienceErrors.UNTIL_BEFORE_FROM.httpStatus
        );
      }
      
      // Actualizar experiencia laboral
      await this.workExperienceRepository.update(id, updateDto);
      
      // Obtener la experiencia laboral actualizada
      const updatedWorkExperience = await this.workExperienceRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!updatedWorkExperience) {
        throw new HttpException(
          WorkExperienceErrors.WORK_EXPERIENCE_NOT_FOUND,
          WorkExperienceErrors.WORK_EXPERIENCE_NOT_FOUND.httpStatus
        );
      }
      
      return new WorkExperienceResponseDto(updatedWorkExperience);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar experiencia laboral: ${error.message}`, error.stack);
      throw new HttpException(
        WorkExperienceErrors.DATABASE_ERROR,
        WorkExperienceErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Elimina una experiencia laboral
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Verificar que la experiencia laboral existe
      const existingWorkExperience = await this.workExperienceRepository.findOne({
        where: { id }
      });
      
      if (!existingWorkExperience) {
        throw new HttpException(
          WorkExperienceErrors.WORK_EXPERIENCE_NOT_FOUND,
          WorkExperienceErrors.WORK_EXPERIENCE_NOT_FOUND.httpStatus
        );
      }
      
      // Eliminar experiencia laboral
      await this.workExperienceRepository.delete(id);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar experiencia laboral: ${error.message}`, error.stack);
      throw new HttpException(
        WorkExperienceErrors.DATABASE_ERROR,
        WorkExperienceErrors.DATABASE_ERROR.httpStatus
      );
    }
  }
}