import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    ParseUUIDPipe,
    HttpStatus,
    HttpCode,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
  import { VacancyService } from './vacancy.service';
  import { 
    CreateVacancyDto, 
    UpdateVacancyDto, 
    VacancyResponseDto
  } from './vacancy.dto';
  import { PaginatedResult } from '../../common/dto/pagination.dto';
  import { VACANCIES_ROUTES } from './constants/routes.constants';

  
  /**
   * Controlador de Vacantes
   * 
   * Implementa los endpoints para el CRUD de vacantes.
   */
  @ApiTags('Vacancies')
  @Controller(VACANCIES_ROUTES.BASE)
  export class VacancyController {
    constructor(private readonly vacancyService: VacancyService) {}
  
    /**
     * Obtiene todas las vacantes con paginación y filtros
     */
    @Get()
    @ApiOperation({ summary: 'Obtener todas las vacantes con paginación y filtros' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de elementos por página' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo/inactivo' })
    @ApiQuery({ name: 'status', required: false, enum: ['open', 'closed', 'on_hold'], description: 'Filtrar por estado de la vacante' })
    @ApiQuery({ name: 'mode', required: false, enum: ['Remoto', 'Presencial', 'Híbrido'], description: 'Filtrar por modalidad de trabajo' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Búsqueda por título, descripción o tecnologías' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista paginada de vacantes',
      type: Promise<PaginatedResult<VacancyResponseDto>>,
    })
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('isActive') isActive?: boolean,
      @Query('status') status?: string,
      @Query('mode') mode?: string,
      @Query('search') search?: string,
    ): Promise<PaginatedResult<VacancyResponseDto>> {
      return this.vacancyService.findAll({
        page,
        limit,
        isActive,
        status,
        mode,
        search,
      });
    }
  
    /**
     * Obtiene una vacante por su ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Obtener una vacante por su ID' })
    @ApiParam({ name: 'id', description: 'ID de la vacante' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Vacante encontrada',
      type: VacancyResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vacante no encontrada',
    })
    async findById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Query('includeApplications') includeApplications?: boolean,
    ): Promise<VacancyResponseDto> {
      return this.vacancyService.findById(id, includeApplications);
    }
  
    /**
     * Obtiene una vacante por su slug
     */
    @Get('slug/:slug')
    @ApiOperation({ summary: 'Obtener una vacante por su slug' })
    @ApiParam({ name: 'slug', description: 'Slug de la vacante' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Vacante encontrada',
      type: VacancyResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vacante no encontrada',
    })
    async findBySlug(
      @Param('slug') slug: string,
      @Query('includeApplications') includeApplications?: boolean,
    ): Promise<VacancyResponseDto> {
      return this.vacancyService.findBySlug(slug, includeApplications);
    }
  
    /**
     * Crea una nueva vacante
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva vacante' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Vacante creada con éxito',
      type: VacancyResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    @ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'El slug ya existe',
    })
    async create(@Body() createDto: CreateVacancyDto): Promise<VacancyResponseDto> {
      return this.vacancyService.create(createDto);
    }
  
    /**
     * Actualiza una vacante existente
     */
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una vacante existente' })
    @ApiParam({ name: 'id', description: 'ID de la vacante' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Vacante actualizada con éxito',
      type: VacancyResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vacante no encontrada',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    @ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'El slug ya existe',
    })
    async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateDto: UpdateVacancyDto,
    ): Promise<VacancyResponseDto> {
      return this.vacancyService.update(id, updateDto);
    }
  
    /**
     * Cambia el estado de una vacante
     */
    @Patch(':id/status')
    @ApiOperation({ summary: 'Cambiar el estado de una vacante' })
    @ApiParam({ name: 'id', description: 'ID de la vacante' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Estado de la vacante actualizado con éxito',
      type: VacancyResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vacante no encontrada',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Estado inválido',
    })
    async changeStatus(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body('status') status: string,
    ): Promise<VacancyResponseDto> {
      return this.vacancyService.changeStatus(id, status);
    }
  
    /**
     * Elimina una vacante
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una vacante' })
    @ApiParam({ name: 'id', description: 'ID de la vacante' })
    @ApiQuery({ name: 'physicalDelete', required: false, type: Boolean, description: 'Realizar borrado físico en lugar de lógico' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Vacante eliminada con éxito',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vacante no encontrada',
    })
    async delete(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Query('physicalDelete') physicalDelete?: boolean,
    ): Promise<void> {
      await this.vacancyService.delete(id, physicalDelete);
    }
  }