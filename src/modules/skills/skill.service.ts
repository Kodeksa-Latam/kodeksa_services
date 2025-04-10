import { Injectable, HttpException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillEntity } from './skill.entity';
import { CreateSkillDto, UpdateSkillDto, SkillResponseDto } from './skill.dto';
import { UserService } from '../users/user.service';
import { SkillErrors } from './errors/skill-errors';

/**
 * Servicio de Habilidades
 * 
 * Implementa la lógica de negocio relacionada con las habilidades de los usuarios.
 */
@Injectable()
export class SkillService {
  private readonly logger = new Logger(SkillService.name);

  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  /**
   * Obtiene todas las habilidades
   */
  async findAll(): Promise<SkillResponseDto[]> {
    try {
      const skills = await this.skillRepository.find({
        relations: ['user'],
      });
      
      return skills.map(skill => new SkillResponseDto(skill));
    } catch (error) {
      this.logger.error(`Error al obtener todas las habilidades: ${error.message}`, error.stack);
      throw new HttpException(
        SkillErrors.DATABASE_ERROR,
        SkillErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene una habilidad por su ID
   */
  async findById(id: string): Promise<SkillResponseDto> {
    try {
      const skill = await this.skillRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!skill) {
        throw new HttpException(
          SkillErrors.SKILL_NOT_FOUND,
          SkillErrors.SKILL_NOT_FOUND.httpStatus
        );
      }
      
      return new SkillResponseDto(skill);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener habilidad por ID: ${error.message}`, error.stack);
      throw new HttpException(
        SkillErrors.DATABASE_ERROR,
        SkillErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene todas las habilidades de un usuario por su ID
   */
  async findByUserId(userId: string): Promise<SkillResponseDto[]> {
    try {
      // Verificar que el usuario existe
      try {
        await this.userService.findById(userId);
      } catch (error) {
        if (error instanceof HttpException) {
          throw new HttpException(
            SkillErrors.USER_NOT_FOUND,
            SkillErrors.USER_NOT_FOUND.httpStatus
          );
        }
        throw error;
      }
      
      const skills = await this.skillRepository.find({
        where: { userId },
        relations: ['user'],
      });
      
      return skills.map(skill => new SkillResponseDto(skill));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener habilidades por ID de usuario: ${error.message}`, error.stack);
      throw new HttpException(
        SkillErrors.DATABASE_ERROR,
        SkillErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea una nueva habilidad
   */
  async create(createDto: CreateSkillDto): Promise<SkillResponseDto> {
    try {
      // Verificar que el usuario existe
      try {
        await this.userService.findById(createDto.userId);
      } catch (error) {
        if (error instanceof HttpException) {
          throw new HttpException(
            SkillErrors.USER_NOT_FOUND,
            SkillErrors.USER_NOT_FOUND.httpStatus
          );
        }
        throw error;
      }
      
      // Crear habilidad
      const newSkill = this.skillRepository.create(createDto);
      const savedSkill = await this.skillRepository.save(newSkill);
      
      return new SkillResponseDto(savedSkill);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear habilidad: ${error.message}`, error.stack);
      throw new HttpException(
        SkillErrors.DATABASE_ERROR,
        SkillErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza una habilidad existente
   */
  async update(id: string, updateDto: UpdateSkillDto): Promise<SkillResponseDto> {
    try {
      // Verificar que la habilidad existe
      const existingSkill = await this.skillRepository.findOne({
        where: { id }
      });
      
      if (!existingSkill) {
        throw new HttpException(
          SkillErrors.SKILL_NOT_FOUND,
          SkillErrors.SKILL_NOT_FOUND.httpStatus
        );
      }
      
      // Si se cambia el usuario, verificar que existe
      if (updateDto.userId && updateDto.userId !== existingSkill.userId) {
        try {
          await this.userService.findById(updateDto.userId);
        } catch (error) {
          if (error instanceof HttpException) {
            throw new HttpException(
              SkillErrors.USER_NOT_FOUND,
              SkillErrors.USER_NOT_FOUND.httpStatus
            );
          }
          throw error;
        }
      }
      
      // Actualizar habilidad
      await this.skillRepository.update(id, updateDto);
      
      // Obtener la habilidad actualizada
      const updatedSkill = await this.skillRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      
      if (!updatedSkill) {
        throw new HttpException(
          SkillErrors.SKILL_NOT_FOUND,
          SkillErrors.SKILL_NOT_FOUND.httpStatus
        );
      }
      
      return new SkillResponseDto(updatedSkill);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar habilidad: ${error.message}`, error.stack);
      throw new HttpException(
        SkillErrors.DATABASE_ERROR,
        SkillErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Elimina una habilidad
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Verificar que la habilidad existe
      const existingSkill = await this.skillRepository.findOne({
        where: { id }
      });
      
      if (!existingSkill) {
        throw new HttpException(
          SkillErrors.SKILL_NOT_FOUND,
          SkillErrors.SKILL_NOT_FOUND.httpStatus
        );
      }
      
      // Eliminar habilidad
      await this.skillRepository.delete(id);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar habilidad: ${error.message}`, error.stack);
      throw new HttpException(
        SkillErrors.DATABASE_ERROR,
        SkillErrors.DATABASE_ERROR.httpStatus
      );
    }
  }
}