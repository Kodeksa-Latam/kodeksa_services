import { Injectable, HttpException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { CreateApplicationDto, UpdateApplicationDto, ApplicationResponseDto } from './application.dto';
import { ApplicationErrors } from './errors/application-errors';
import { VacancyService } from '../vacancies/vacancy.service';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { CloudinaryService } from 'src/common/services/cloudinary.service';

/**
 * Servicio de Aplicaciones a Vacantes
 * 
 * Implementa la lógica de negocio relacionada con las aplicaciones a vacantes.
 */
@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @Inject(forwardRef(() => VacancyService))
    private readonly vacancyService: VacancyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Obtiene todas las aplicaciones con paginación y filtros
   */
  async findAll(options: {
    page: number;
    limit: number;
    isActive?: boolean;
    status?: string;
    vacancyId?: string;
    search?: string;
  }): Promise<PaginatedResult<ApplicationResponseDto>> {
    try {
      const { page = 1, limit = 10, isActive, status, vacancyId, search } = options;
      const skip = (page - 1) * limit;
      
      // Construir las condiciones de búsqueda
      const where: FindOptionsWhere<ApplicationEntity> = {};
      
      if (isActive !== undefined) {
        where.isActive = isActive;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (vacancyId) {
        where.vacancyId = vacancyId;
      }
      
      // Búsqueda por varios campos
      if (search) {
        return this.searchApplications(search, { page, limit, where });
      }
      
      // Obtener aplicaciones y contar total
      const [applications, totalItems] = await this.applicationRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['vacancy'],
      });
      
      const items = applications.map(application => new ApplicationResponseDto(application));
      
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
      this.logger.error(`Error al obtener aplicaciones: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Busca aplicaciones por término en varios campos
   */
  private async searchApplications(
    searchTerm: string,
    options: { page: number; limit: number; where: FindOptionsWhere<ApplicationEntity> }
  ): Promise<PaginatedResult<ApplicationResponseDto>> {
    try {
      const { page, limit, where } = options;
      const skip = (page - 1) * limit;
      
      // Buscar en varios campos
      const queryBuilder = this.applicationRepository.createQueryBuilder('application');
      
      // Aplicar condiciones where
      if (where.isActive !== undefined) {
        queryBuilder.andWhere('application.isActive = :isActive', { isActive: where.isActive });
      }
      
      if (where.status) {
        queryBuilder.andWhere('application.status = :status', { status: where.status });
      }
      
      if (where.vacancyId) {
        queryBuilder.andWhere('application.vacancyId = :vacancyId', { vacancyId: where.vacancyId });
      }
      
      // Buscar en varios campos
      queryBuilder.andWhere(
        '(application.name ILIKE :search OR application.email ILIKE :search OR application.phone ILIKE :search OR application.applicationMotivation ILIKE :search)',
        { search: `%${searchTerm}%` }
      );
      
      // Incluir relación con vacancy
      queryBuilder.leftJoinAndSelect('application.vacancy', 'vacancy');
      
      // Paginación
      queryBuilder.skip(skip).take(limit);
      
      // Ordenamiento
      queryBuilder.orderBy('application.createdAt', 'DESC');
      
      // Ejecutar consulta
      const [applications, totalItems] = await queryBuilder.getManyAndCount();
      
      const items = applications.map(application => new ApplicationResponseDto(application));
      
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
      this.logger.error(`Error al buscar aplicaciones: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene una aplicación por su ID
   */
  async findById(id: string): Promise<ApplicationResponseDto> {
    try {
      const application = await this.applicationRepository.findOne({
        where: { id },
        relations: ['vacancy'],
      });
      
      if (!application) {
        throw new HttpException(
          ApplicationErrors.APPLICATION_NOT_FOUND,
          ApplicationErrors.APPLICATION_NOT_FOUND.httpStatus
        );
      }
      
      return new ApplicationResponseDto(application);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener aplicación por ID: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Obtiene aplicaciones por ID de vacante
   */
  async findByVacancyId(vacancyId: string, options: {
    page: number;
    limit: number;
    isActive?: boolean;
    status?: string;
    search?: string;
  }): Promise<PaginatedResult<ApplicationResponseDto>> {
    try {
      // Verificar que la vacante existe
      try {
        await this.vacancyService.findById(vacancyId);
      } catch (error) {
        throw new HttpException(
          ApplicationErrors.VACANCY_NOT_FOUND,
          ApplicationErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      // Usar el método findAll con el ID de vacante como filtro
      return this.findAll({
        ...options,
        vacancyId,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al obtener aplicaciones por ID de vacante: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea una nueva aplicación con CV
   */
  async createWithCV(createDto: CreateApplicationDto, cvFile: Express.Multer.File): Promise<ApplicationResponseDto> {
    try {
      // Verificar que la vacante existe y está abierta
      try {
        const vacancy = await this.vacancyService.findById(createDto.vacancyId);
        
        if (!vacancy.isActive) {
          throw new HttpException(
            ApplicationErrors.VACANCY_INACTIVE,
            ApplicationErrors.VACANCY_INACTIVE.httpStatus
          );
        }
        
        if (vacancy.status !== 'open') {
          throw new HttpException(
            ApplicationErrors.VACANCY_CLOSED,
            ApplicationErrors.VACANCY_CLOSED.httpStatus
          );
        }
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException(
          ApplicationErrors.VACANCY_NOT_FOUND,
          ApplicationErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      // Verificar que no exista una aplicación con el mismo email para esta vacante
      const existingApplication = await this.applicationRepository.findOne({
        where: {
          email: createDto.email,
          vacancyId: createDto.vacancyId,
        }
      });
      
      if (existingApplication) {
        throw new HttpException(
          ApplicationErrors.APPLICATION_ALREADY_EXISTS,
          ApplicationErrors.APPLICATION_ALREADY_EXISTS.httpStatus
        );
      }
      
      // Subir CV a Cloudinary
      let cvUrl = '';
      if (cvFile) {
        try {
          cvUrl = await this.cloudinaryService.uploadFile(cvFile, 'kodeksa/application-resumes');
          this.logger.log(`CV subido a Cloudinary: ${cvUrl}`);
        } catch (uploadError) {
          this.logger.error(`Error al subir CV a Cloudinary: ${uploadError.message}`, uploadError.stack);
          throw new HttpException(
            ApplicationErrors.CV_UPLOAD_ERROR,
            ApplicationErrors.CV_UPLOAD_ERROR.httpStatus
          );
        }
      }
      
      // Crear la aplicación con la URL del CV
      const newApplication = this.applicationRepository.create({
        ...createDto,
        cvUrl,
        status: 'pending', // Estado inicial
        isActive: true,
      });
      
      const savedApplication = await this.applicationRepository.save(newApplication);
      
      // Recuperar la aplicación con relaciones
      const completeApplication = await this.applicationRepository.findOne({
        where: { id: savedApplication.id },
        relations: ['vacancy'],
      });

      if (!completeApplication) {
        throw new HttpException(
          ApplicationErrors.APPLICATION_NOT_CREATED,
          ApplicationErrors.APPLICATION_NOT_CREATED.httpStatus
        );
      }
      
      return new ApplicationResponseDto(completeApplication);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear aplicación: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Crea una nueva aplicación
   */
  async create(createDto: CreateApplicationDto): Promise<ApplicationResponseDto> {
    try {
      // Verificar que la vacante existe y está abierta
      try {
        const vacancy = await this.vacancyService.findById(createDto.vacancyId);
        
        if (vacancy.status !== 'open') {
          throw new HttpException(
            ApplicationErrors.VACANCY_CLOSED,
            ApplicationErrors.VACANCY_CLOSED.httpStatus
          );
        }
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        
        throw new HttpException(
          ApplicationErrors.VACANCY_NOT_FOUND,
          ApplicationErrors.VACANCY_NOT_FOUND.httpStatus
        );
      }
      
      // Verificar si ya existe una aplicación con el mismo email para esta vacante
      const existingApplication = await this.applicationRepository.findOne({
        where: {
          vacancyId: createDto.vacancyId,
          email: createDto.email,
        }
      });
      
      if (existingApplication) {
        throw new HttpException(
          ApplicationErrors.ALREADY_APPLIED,
          ApplicationErrors.ALREADY_APPLIED.httpStatus
        );
      }
      
      // Aplicar valores por defecto
      if (createDto.isActive === undefined) {
        createDto.isActive = true;
      }
      
      // Crear aplicación
      const newApplication = this.applicationRepository.create({
        ...createDto,
        status: 'pending', // Estado inicial siempre es 'pending'
      });
      
      const savedApplication = await this.applicationRepository.save(newApplication);
      
      // Obtener la aplicación completa con relaciones
      const applicationWithRelations = await this.applicationRepository.findOne({
        where: { id: savedApplication.id },
        relations: ['vacancy'],
      });
      
      return new ApplicationResponseDto(applicationWithRelations || savedApplication);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al crear aplicación: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }

  /**
   * Actualiza una aplicación existente
   */
  async update(id: string, updateDto: UpdateApplicationDto): Promise<ApplicationResponseDto> {
    try {
      // Verificar que la aplicación existe
      const existingApplication = await this.applicationRepository.findOne({
        where: { id }
      });
      
      if (!existingApplication) {
        throw new HttpException(
          ApplicationErrors.APPLICATION_NOT_FOUND,
          ApplicationErrors.APPLICATION_NOT_FOUND.httpStatus
        );
      }
      
      // Si se cambia la vacante, verificar que existe y está abierta
      if (updateDto.vacancyId && updateDto.vacancyId !== existingApplication.vacancyId) {
        try {
          const vacancy = await this.vacancyService.findById(updateDto.vacancyId);
          
          if (vacancy.status !== 'open') {
            throw new HttpException(
              ApplicationErrors.VACANCY_CLOSED,
              ApplicationErrors.VACANCY_CLOSED.httpStatus
            );
          }
          
          // Verificar si ya existe una aplicación con el mismo email para esta nueva vacante
          const email = updateDto.email ?? existingApplication.email;
          const existingApplicationForNewVacancy = await this.applicationRepository.findOne({
            where: {
              vacancyId: updateDto.vacancyId,
              email: email,
            }
          });
          
          if (existingApplicationForNewVacancy) {
            throw new HttpException(
              ApplicationErrors.ALREADY_APPLIED,
              ApplicationErrors.ALREADY_APPLIED.httpStatus
            );
          }
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          }
          
          throw new HttpException(
            ApplicationErrors.VACANCY_NOT_FOUND,
            ApplicationErrors.VACANCY_NOT_FOUND.httpStatus
          );
        }
      }
      
      // Actualizar aplicación
      await this.applicationRepository.update(id, updateDto);
      
      // Obtener la aplicación actualizada
      const updatedApplication = await this.applicationRepository.findOne({
        where: { id },
        relations: ['vacancy'],
      });
      
      if (!updatedApplication) {
        throw new HttpException(
          ApplicationErrors.APPLICATION_NOT_FOUND,
          ApplicationErrors.APPLICATION_NOT_FOUND.httpStatus
        );
      }
      
      return new ApplicationResponseDto(updatedApplication);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar aplicación: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }
  
  /**
   * Actualiza el estado de una aplicación
   */
  async updateStatus(id: string, status: string): Promise<ApplicationResponseDto> {
    try {
      // Validar el estado
      if (!['pending', 'in_review', 'accepted', 'rejected'].includes(status)) {
        throw new HttpException(
          ApplicationErrors.INVALID_STATUS,
          ApplicationErrors.INVALID_STATUS.httpStatus
        );
      }
      
      // Verificar que la aplicación existe
      const existingApplication = await this.applicationRepository.findOne({
        where: { id }
      });
      
      if (!existingApplication) {
        throw new HttpException(
          ApplicationErrors.APPLICATION_NOT_FOUND,
          ApplicationErrors.APPLICATION_NOT_FOUND.httpStatus
        );
      }
      
      // Actualizar estado
      await this.applicationRepository.update(id, { status });
      
      // Obtener la aplicación actualizada
      const updatedApplication = await this.applicationRepository.findOne({
        where: { id },
        relations: ['vacancy'],
      });
      
      if (!updatedApplication) {
        throw new HttpException(
          ApplicationErrors.APPLICATION_NOT_FOUND,
          ApplicationErrors.APPLICATION_NOT_FOUND.httpStatus
        );
      }
      
      return new ApplicationResponseDto(updatedApplication);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al actualizar estado de aplicación: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }
  
  /**
   * Elimina una aplicación (borrado lógico o físico según configuración)
   */
  async delete(id: string, physicalDelete: boolean = false): Promise<boolean> {
    try {
      // Verificar que la aplicación existe
      const existingApplication = await this.applicationRepository.findOne({
        where: { id }
      });
      
      if (!existingApplication) {
        throw new HttpException(
          ApplicationErrors.APPLICATION_NOT_FOUND,
          ApplicationErrors.APPLICATION_NOT_FOUND.httpStatus
        );
      }
      
      if (physicalDelete) {
        // Borrado físico
        await this.applicationRepository.delete(id);
      } else {
        // Borrado lógico
        await this.applicationRepository.update(id, { isActive: false });
      }
      
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Error al eliminar aplicación: ${error.message}`, error.stack);
      throw new HttpException(
        ApplicationErrors.DATABASE_ERROR,
        ApplicationErrors.DATABASE_ERROR.httpStatus
      );
    }
  }
}