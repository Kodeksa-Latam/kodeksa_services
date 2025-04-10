import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolutionEntity } from './solution.entity';
import { FeatureEntity } from './feature.entity';
import { 
  CreateSolutionDto, 
  UpdateSolutionDto, 
  SolutionResponseDto,
  CreateFeatureDto,
  UpdateFeatureDto,
  FeatureResponseDto
} from './solution.dto';
import { SolutionErrors } from './errors/solution-errors';

/**
 * Servicio de Soluciones
 * 
 * Implementa la lógica de negocio relacionada con las soluciones y sus características.
 */
@Injectable()
export class SolutionService {
  private readonly logger = new Logger(SolutionService.name);

  constructor(
    @InjectRepository(SolutionEntity)
    private readonly solutionRepository: Repository<SolutionEntity>,
    @InjectRepository(FeatureEntity)
    private readonly featureRepository: Repository<FeatureEntity>,
  ) {}

  /**
   * Obtiene todas las soluciones activas
   * Las características siempre se incluyen en la respuesta
   */
  async findAll(includeFeatures: boolean = true): Promise<SolutionResponseDto[]> {
    try {
      // Siempre incluir features independientemente del parámetro
      const solutions = await this.solutionRepository.find({
        where: { isActive: true },
        relations: ['features'],
        order: { order: 'ASC' },
      });
      
      return solutions.map(solution => this.mapToResponseDto(solution));
    } catch (error) {
      this.logger.error(`Error al obtener soluciones: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene todas las soluciones (incluidas inactivas)
   * Las características siempre se incluyen en la respuesta
   */
  async findAllAdmin(includeFeatures: boolean = true): Promise<SolutionResponseDto[]> {
    try {
      // Siempre incluir features independientemente del parámetro
      const solutions = await this.solutionRepository.find({
        relations: ['features'],
        order: { order: 'ASC' },
      });
      
      return solutions.map(solution => this.mapToResponseDto(solution));
    } catch (error) {
      this.logger.error(`Error al obtener soluciones para admin: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene una solución por su ID
   * Las características siempre se incluyen en la respuesta
   */
  async findById(id: string, includeFeatures: boolean = true): Promise<SolutionResponseDto> {
    try {
      // Siempre cargar las features independientemente del parámetro
      const solution = await this.solutionRepository.findOne({
        where: { id },
        relations: ['features'],
      });
      
      if (!solution) {
        throw new HttpException(
          SolutionErrors.SOLUTION_NOT_FOUND,
          SolutionErrors.SOLUTION_NOT_FOUND.httpStatus
        );
      }
      
      return this.mapToResponseDto(solution);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener solución por ID: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea una nueva solución
   */
  async create(createDto: CreateSolutionDto): Promise<SolutionResponseDto> {
    try {
      // Crear solución
      const newSolution = this.solutionRepository.create(createDto);
      const savedSolution = await this.solutionRepository.save(newSolution);
      
      // Si hay características, crearlas
      if (createDto.features && createDto.features.length > 0) {
        for (const featureDto of createDto.features) {
          const newFeature = this.featureRepository.create({
            ...featureDto,
            solutionId: savedSolution.id
          });
          await this.featureRepository.save(newFeature);
        }
      }
      
      // Obtener solución completa con características
      return this.findById(savedSolution.id);
    } catch (error) {
      this.logger.error(`Error al crear solución: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza una solución existente
   */
  async update(id: string, updateDto: UpdateSolutionDto): Promise<SolutionResponseDto> {
    try {
      // Verificar que la solución existe
      const existingSolution = await this.solutionRepository.findOne({
        where: { id }
      });
      
      if (!existingSolution) {
        throw new HttpException(
          SolutionErrors.SOLUTION_NOT_FOUND,
          SolutionErrors.SOLUTION_NOT_FOUND.httpStatus
        );
      }
      
      // Actualizar solución
      await this.solutionRepository.update(id, updateDto);
      
      // Si hay características nuevas, actualizar o crearlas
      if (updateDto.features && updateDto.features.length > 0) {
        for (const featureDto of updateDto.features) {
          const newFeature = this.featureRepository.create({
            ...featureDto,
            solutionId: id
          });
          await this.featureRepository.save(newFeature);
        }
      }
      
      // Obtener la solución actualizada
      return this.findById(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar solución: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Elimina una solución
   */
  async delete(id: string): Promise<boolean> {
    try {
      // Verificar que la solución existe
      const existingSolution = await this.solutionRepository.findOne({
        where: { id },
        relations: ['features'],
      });
      
      if (!existingSolution) {
        throw new HttpException(
          SolutionErrors.SOLUTION_NOT_FOUND,
          SolutionErrors.SOLUTION_NOT_FOUND.httpStatus
        );
      }
      
      // Eliminar características relacionadas
      if (existingSolution.features && existingSolution.features.length > 0) {
        await this.featureRepository.remove(existingSolution.features);
      }
      
      // Eliminar solución
      await this.solutionRepository.delete(id);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar solución: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea una nueva característica para una solución
   */
  async createFeature(createDto: CreateFeatureDto): Promise<FeatureResponseDto> {
    try {
      // Verificar que la solución existe
      const existingSolution = await this.solutionRepository.findOne({
        where: { id: createDto.solutionId }
      });
      
      if (!existingSolution) {
        throw new HttpException(
          SolutionErrors.SOLUTION_NOT_FOUND,
          SolutionErrors.SOLUTION_NOT_FOUND.httpStatus
        );
      }
      
      // Crear característica
      const newFeature = this.featureRepository.create(createDto);
      const savedFeature = await this.featureRepository.save(newFeature);
      
      return this.mapFeatureToResponseDto(savedFeature);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear característica: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza una característica existente
   */
  async updateFeature(id: string, updateDto: UpdateFeatureDto): Promise<FeatureResponseDto> {
    try {
      // Verificar que la característica existe
      const existingFeature = await this.featureRepository.findOne({
        where: { id }
      });
      
      if (!existingFeature) {
        throw new HttpException(
          SolutionErrors.FEATURE_NOT_FOUND,
          SolutionErrors.FEATURE_NOT_FOUND.httpStatus
        );
      }
      
      // Si cambia la solución, verificar que existe
      if (updateDto.solutionId && updateDto.solutionId !== existingFeature.solutionId) {
        const solution = await this.solutionRepository.findOne({
          where: { id: updateDto.solutionId }
        });
        
        if (!solution) {
          throw new HttpException(
            SolutionErrors.SOLUTION_NOT_FOUND,
            SolutionErrors.SOLUTION_NOT_FOUND.httpStatus
          );
        }
      }
      
      // Actualizar característica
      await this.featureRepository.update(id, updateDto);
      
      // Obtener la característica actualizada
      const updatedFeature = await this.featureRepository.findOne({
        where: { id },
        relations: ['solution'],
      });
      
      if (!updatedFeature) {
        throw new HttpException(
          SolutionErrors.FEATURE_NOT_FOUND,
          SolutionErrors.FEATURE_NOT_FOUND.httpStatus
        );
      }
      
      return this.mapFeatureToResponseDto(updatedFeature);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar característica: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Elimina una característica
   */
  async deleteFeature(id: string): Promise<boolean> {
    try {
      // Verificar que la característica existe
      const existingFeature = await this.featureRepository.findOne({
        where: { id }
      });
      
      if (!existingFeature) {
        throw new HttpException(
          SolutionErrors.FEATURE_NOT_FOUND,
          SolutionErrors.FEATURE_NOT_FOUND.httpStatus
        );
      }
      
      // Eliminar característica
      await this.featureRepository.delete(id);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar característica: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene las características de una solución
   */
  async getFeaturesBySolutionId(solutionId: string): Promise<FeatureResponseDto[]> {
    try {
      // Verificar que la solución existe
      const existingSolution = await this.solutionRepository.findOne({
        where: { id: solutionId }
      });
      
      if (!existingSolution) {
        throw new HttpException(
          SolutionErrors.SOLUTION_NOT_FOUND,
          SolutionErrors.SOLUTION_NOT_FOUND.httpStatus
        );
      }
      
      // Obtener características
      const features = await this.featureRepository.find({
        where: { solutionId },
        relations: ['solution'],
      });
      
      return features.map(feature => this.mapFeatureToResponseDto(feature));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener características: ${error.message}`, error.stack);
      throw new HttpException(
        SolutionErrors.DATABASE_ERROR,
        SolutionErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Mapea la entidad de solución al DTO de respuesta
   */
  private mapToResponseDto(solution: SolutionEntity): SolutionResponseDto {
    const responseDto = new SolutionResponseDto(solution);
    
    // Asegurarnos de que siempre haya un array de features, incluso si está vacío
    responseDto.features = solution.features 
      ? solution.features.map(feature => this.mapFeatureToResponseDto(feature))
      : [];
    
    return responseDto;
  }

  /**
   * Mapea la entidad de característica al DTO de respuesta
   */
  private mapFeatureToResponseDto(feature: FeatureEntity): FeatureResponseDto {
    return new FeatureResponseDto(feature);
  }
}