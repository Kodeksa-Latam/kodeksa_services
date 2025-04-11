import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { VacancyEntity } from './vacancy.entity';
import { CreateVacancyDto, UpdateVacancyDto, VacancyResponseDto } from './vacancy.dto';
import { VacancyErrors } from './errors/vacancy-errors';
import { PaginatedResult } from '../../common/dto/pagination.dto';

/**
 * Servicio de Vacantes
 * 
 * Implementa la lógica de negocio relacionada con las vacantes.
 */
@Injectable()
export class VacancyService {
  private readonly logger = new Logger(VacancyService.name);

  constructor(
    @InjectRepository(VacancyEntity)
    private readonly vacancyRepository: Repository<VacancyEntity>,
  ) {}

  /**
   * Obtiene todas las vacantes con paginación y filtros
   */
  async findAll(options: {
    page: number;
    limit: number;
    isActive?: boolean;
    status?: string;
    search?: string;
    mode?: string;
  }): Promise<PaginatedResult<VacancyResponseDto>> {
    try {
      const { page = 1, limit = 10, isActive, status, search, mode } = options;
      const skip = (page - 1) * limit;
      
      // Construir las condiciones de búsqueda
      const where: FindOptionsWhere<VacancyEntity> = {};
      
      if (isActive !== undefined) {
        where.isActive = isActive;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (mode) {
        where.mode = mode;
      }
      
      // Búsqueda por varios campos
      if (search) {
        return this.searchVacancies(search, { page, limit, where });
      }
      
      // Obtener vacantes y contar total
      const [vacancies, totalItems] = await this.vacancyRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      
      const items = vacancies.map(vacancy => new VacancyResponseDto(vacancy));
      
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
      this.logger.error(`Error al obtener vacantes: ${error.message}`, error.stack);
      throw new HttpException(
        VacancyErrors.DATABASE_ERROR,
        VacancyErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Busca vacantes por término en varios campos
   */
  private async searchVacancies(
    searchTerm: string,
    options: { page: number; limit: number; where: FindOptionsWhere<VacancyEntity> }
  ): Promise<PaginatedResult<VacancyResponseDto>> {
    try {
      const { page, limit, where } = options;
      const skip = (page - 1) * limit;
      
      // Buscar en varios campos
      const queryBuilder = this.vacancyRepository.createQueryBuilder('vacancy');
      
      // Aplicar condiciones where
      if (where.isActive !== undefined) {
        queryBuilder.andWhere('vacancy.isActive = :isActive', { isActive: where.isActive });
      }
      
      if (where.status) {
        queryBuilder.andWhere('vacancy.status = :status', { status: where.status });
      }
      
      if (where.mode) {
        queryBuilder.andWhere('vacancy.mode = :mode', { mode: where.mode });
      }
      
      // Buscar en varios campos
      queryBuilder.andWhere(
        '(vacancy.jobTitle ILIKE :search OR vacancy.shortDescription ILIKE :search OR vacancy.description ILIKE :search OR vacancy.stackRequired::text ILIKE :search)',
        { search: `%${searchTerm}%` }
      );
      
      // Paginación
      queryBuilder.skip(skip).take(limit);
      
      // Ordenamiento
      queryBuilder.orderBy('vacancy.createdAt', 'DESC');
      
      // Ejecutar consulta
      const [vacancies, totalItems] = await queryBuilder.getManyAndCount();
      
      const items = vacancies.map(vacancy => new VacancyResponseDto(vacancy));
      
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
      this.logger.error(`Error al buscar vacantes: ${error.message}`, error.stack);
      throw new HttpException(
        VacancyErrors.DATABASE_ERROR,
        VacancyErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene una vacante por su ID
   */
  async findById(id: string, includeApplications: boolean = false): Promise<VacancyResponseDto> {
    try {
      const relations = includeApplications ? ['applications'] : [];
      
      const vacancy = await this.vacancyRepository.findOne({
        where: { id },
        relations,
      });
      
      if (!vacancy) {
        throw new HttpException(
          VacancyErrors.VACANCY_NOT_FOUND,
          VacancyErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      return new VacancyResponseDto(vacancy);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener vacante por ID: ${error.message}`, error.stack);
      throw new HttpException(
        VacancyErrors.DATABASE_ERROR,
        VacancyErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene una vacante por su slug
   */
  async findBySlug(slug: string, includeApplications: boolean = false): Promise<VacancyResponseDto> {
    try {
      const relations = includeApplications ? ['applications'] : [];
      
      const vacancy = await this.vacancyRepository.findOne({
        where: { slug },
        relations,
      });
      
      if (!vacancy) {
        throw new HttpException(
          VacancyErrors.VACANCY_SLUG_NOT_FOUND,
          VacancyErrors.VACANCY_SLUG_NOT_FOUND.httpStatus
        );
      }
      
      return new VacancyResponseDto(vacancy);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener vacante por slug: ${error.message}`, error.stack);
      throw new HttpException(
        VacancyErrors.DATABASE_ERROR,
        VacancyErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea una nueva vacante
   */
  async create(createDto: CreateVacancyDto): Promise<VacancyResponseDto> {
    try {
      // Si no se proporciona un slug, generarlo a partir del título
      if (!createDto.slug) {
        createDto.slug = this.generateSlug(createDto.jobTitle);
      } else {
        // Si se proporciona, asegurarse de que esté en formato de slug
        createDto.slug = this.generateSlug(createDto.slug);
      }
      
      // Verificar que el slug no exista
      const existingVacancy = await this.vacancyRepository.findOne({
        where: { slug: createDto.slug }
      });
      
      if (existingVacancy) {
        throw new HttpException(
          VacancyErrors.SLUG_ALREADY_EXISTS,
          VacancyErrors.SLUG_ALREADY_EXISTS.httpStatus
        );
      }
      
      // Aplicar valores por defecto
      if (createDto.isActive === undefined) {
        createDto.isActive = true;
      }
      
      if (!createDto.status) {
        createDto.status = 'open';
      }
      
      // Crear vacante
      const newVacancy = this.vacancyRepository.create(createDto);
      const savedVacancy = await this.vacancyRepository.save(newVacancy);
      
      return new VacancyResponseDto(savedVacancy);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear vacante: ${error.message}`, error.stack);
      throw new HttpException(
        VacancyErrors.DATABASE_ERROR,
        VacancyErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza una vacante existente
   */
  async update(id: string, updateDto: UpdateVacancyDto): Promise<VacancyResponseDto> {
    try {
      // Verificar que la vacante existe
      const existingVacancy = await this.vacancyRepository.findOne({
        where: { id }
      });
      
      if (!existingVacancy) {
        throw new HttpException(
          VacancyErrors.VACANCY_NOT_FOUND,
          VacancyErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      // Si se actualiza el slug, formatearlo y verificar que no exista
      if (updateDto.slug) {
        updateDto.slug = this.generateSlug(updateDto.slug);
        
        const vacancyWithSlug = await this.vacancyRepository.findOne({
          where: { slug: updateDto.slug }
        });
        
        if (vacancyWithSlug && vacancyWithSlug.id !== id) {
          throw new HttpException(
            VacancyErrors.SLUG_ALREADY_EXISTS,
            VacancyErrors.SLUG_ALREADY_EXISTS.httpStatus
          );
        }
      }
      
      // Si se actualiza el título pero no el slug, actualizar el slug
      if (updateDto.jobTitle && !updateDto.slug) {
        updateDto.slug = this.generateSlug(updateDto.jobTitle);
        
        // Verificar que el nuevo slug no exista
        const vacancyWithSlug = await this.vacancyRepository.findOne({
          where: { slug: updateDto.slug }
        });
        
        if (vacancyWithSlug && vacancyWithSlug.id !== id) {
          // Si ya existe, añadir un sufijo numérico
          updateDto.slug = `${updateDto.slug}-${Date.now().toString().slice(-4)}`;
        }
      }
      
      // Actualizar vacante
      await this.vacancyRepository.update(id, updateDto);
      
      // Obtener la vacante actualizada
      const updatedVacancy = await this.vacancyRepository.findOne({
        where: { id },
      });
      
      if (!updatedVacancy) {
        throw new HttpException(
          VacancyErrors.VACANCY_NOT_FOUND,
          VacancyErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      return new VacancyResponseDto(updatedVacancy);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar vacante: ${error.message}`, error.stack);
      throw new HttpException(
        VacancyErrors.DATABASE_ERROR,
        VacancyErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Elimina una vacante (borrado lógico o físico según configuración)
   */
  async delete(id: string, physicalDelete: boolean = false): Promise<boolean> {
    try {
      // Verificar que la vacante existe
      const existingVacancy = await this.vacancyRepository.findOne({
        where: { id }
      });
      
      if (!existingVacancy) {
        throw new HttpException(
          VacancyErrors.VACANCY_NOT_FOUND,
          VacancyErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      if (physicalDelete) {
        // Borrado físico
        await this.vacancyRepository.delete(id);
      } else {
        // Borrado lógico
        await this.vacancyRepository.update(id, { 
          isActive: false,
          status: 'closed'
        });
      }
      
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar vacante: ${error.message}`, error.stack);
      throw new HttpException(
        VacancyErrors.DATABASE_ERROR,
        VacancyErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Cambia el estado de una vacante
   */
  async changeStatus(id: string, status: string): Promise<VacancyResponseDto> {
    try {
      // Validar el estado
      if (!['open', 'closed', 'on_hold'].includes(status)) {
        throw new HttpException(
          VacancyErrors.INVALID_STATUS,
          VacancyErrors.INVALID_STATUS.httpStatus
        );
      }
      
      // Verificar que la vacante existe
      const existingVacancy = await this.vacancyRepository.findOne({
        where: { id }
      });
      
      if (!existingVacancy) {
        throw new HttpException(
          VacancyErrors.VACANCY_NOT_FOUND,
          VacancyErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      // Actualizar estado
      await this.vacancyRepository.update(id, { status });
      
      // Obtener la vacante actualizada
      const updatedVacancy = await this.vacancyRepository.findOne({
        where: { id },
      });
      
      if (!updatedVacancy) {
        throw new HttpException(
          VacancyErrors.VACANCY_NOT_FOUND,
          VacancyErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      return new VacancyResponseDto(updatedVacancy);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al cambiar estado de vacante: ${error.message}`, error.stack);
      throw new HttpException(
        VacancyErrors.DATABASE_ERROR,
        VacancyErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Utilidad para generar slugs a partir de textos
   */
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