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
  import { ApplicationService } from './application.service';
  import { 
    CreateApplicationDto, 
    UpdateApplicationDto, 
    ApplicationResponseDto,
    FilterApplicationDto 
  } from './application.dto';
  import { PaginatedResult } from '../../common/dto/pagination.dto';
  import { APPLICATIONS_ROUTES } from './constants/routes.constants';
  
  /**
   * Controlador de Aplicaciones a Vacantes
   * 
   * Implementa los endpoints para el CRUD de aplicaciones a vacantes.
   */
  @ApiTags('Applications')
  @Controller(APPLICATIONS_ROUTES.BASE)
  export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}
  
    /**
     * Obtiene todas las aplicaciones con paginación y filtros
     */
    @Get()
    @ApiOperation({ summary: 'Obtener todas las aplicaciones con paginación y filtros' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de elementos por página' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo/inactivo' })
    @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in_review', 'accepted', 'rejected'], description: 'Filtrar por estado de la aplicación' })
    @ApiQuery({ name: 'vacancyId', required: false, type: String, description: 'Filtrar por ID de vacante' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Búsqueda por nombre o email' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista paginada de aplicaciones',
      type: Promise<PaginatedResult<ApplicationResponseDto>>,
    })
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('isActive') isActive?: boolean,
      @Query('status') status?: string,
      @Query('vacancyId') vacancyId?: string,
      @Query('search') search?: string,
    ): Promise<PaginatedResult<ApplicationResponseDto>> {
      return this.applicationService.findAll({
        page,
        limit,
        isActive,
        status,
        vacancyId,
        search,
      });
    }
  
    /**
     * Obtiene una aplicación por su ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Obtener una aplicación por su ID' })
    @ApiParam({ name: 'id', description: 'ID de la aplicación' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Aplicación encontrada',
      type: ApplicationResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Aplicación no encontrada',
    })
    async findById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<ApplicationResponseDto> {
      return this.applicationService.findById(id);
    }
  
    /**
     * Obtiene aplicaciones por ID de vacante
     */
    @Get('vacancy/:vacancyId')
    @ApiOperation({ summary: 'Obtener todas las aplicaciones para una vacante específica' })
    @ApiParam({ name: 'vacancyId', description: 'ID de la vacante' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de elementos por página' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo/inactivo' })
    @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in_review', 'accepted', 'rejected'], description: 'Filtrar por estado de la aplicación' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Búsqueda por nombre o email' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista paginada de aplicaciones para la vacante especificada',
      type: Promise<PaginatedResult<ApplicationResponseDto>>,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vacante no encontrada',
    })
    async findByVacancyId(
      @Param('vacancyId', new ParseUUIDPipe({ version: '4' })) vacancyId: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('isActive') isActive?: boolean,
      @Query('status') status?: string,
      @Query('search') search?: string,
    ): Promise<PaginatedResult<ApplicationResponseDto>> {
      return this.applicationService.findByVacancyId(vacancyId, {
        page,
        limit,
        isActive,
        status,
        search,
      });
    }
  
    /**
     * Crea una nueva aplicación
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva aplicación para una vacante' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Aplicación creada con éxito',
      type: ApplicationResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Vacante no encontrada',
    })
    @ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'La vacante está cerrada y no acepta nuevas aplicaciones',
    })
    @ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Ya existe una aplicación con este email para esta vacante',
    })
    async create(@Body() createDto: CreateApplicationDto): Promise<ApplicationResponseDto> {
      return this.applicationService.create(createDto);
    }
  
    /**
     * Actualiza una aplicación existente
     */
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una aplicación existente' })
    @ApiParam({ name: 'id', description: 'ID de la aplicación' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Aplicación actualizada con éxito',
      type: ApplicationResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Aplicación no encontrada',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateDto: UpdateApplicationDto,
    ): Promise<ApplicationResponseDto> {
      return this.applicationService.update(id, updateDto);
    }
  
    /**
     * Actualiza el estado de una aplicación
     */
    @Patch(':id/status')
    @ApiOperation({ summary: 'Actualizar el estado de una aplicación' })
    @ApiParam({ name: 'id', description: 'ID de la aplicación' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Estado de la aplicación actualizado con éxito',
      type: ApplicationResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Aplicación no encontrada',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Estado inválido',
    })
    async updateStatus(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body('status') status: string,
    ): Promise<ApplicationResponseDto> {
      return this.applicationService.updateStatus(id, status);
    }
  
    /**
     * Elimina una aplicación
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una aplicación' })
    @ApiParam({ name: 'id', description: 'ID de la aplicación' })
    @ApiQuery({ name: 'physicalDelete', required: false, type: Boolean, description: 'Realizar borrado físico en lugar de lógico' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Aplicación eliminada con éxito',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Aplicación no encontrada',
    })
    async delete(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Query('physicalDelete') physicalDelete?: boolean,
    ): Promise<void> {
      await this.applicationService.delete(id, physicalDelete);
    }
  }