import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpStatus,
    HttpCode,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
  import { WorkExperienceService } from './work-experience.service';
  import { CreateWorkExperienceDto, UpdateWorkExperienceDto, WorkExperienceResponseDto } from './work-experience.dto';
  import { WORK_EXPERIENCES_ROUTES } from './constants/routes.constants';
  
  /**
   * Controlador de Experiencias Laborales
   * 
   * Gestiona las peticiones HTTP relacionadas con experiencias laborales.
   * Implementa los endpoints para el CRUD.
   */
  @ApiTags('work-experiences')
  @Controller(WORK_EXPERIENCES_ROUTES.BASE)
  export class WorkExperienceController {
    constructor(private readonly workExperienceService: WorkExperienceService) {}
  
    /**
     * Obtiene todas las experiencias laborales
     */
    @Get()
    @ApiOperation({ summary: 'Obtener todas las experiencias laborales' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de experiencias laborales obtenida correctamente',
      type: [WorkExperienceResponseDto],
    })
    async findAll(): Promise<WorkExperienceResponseDto[]> {
      return this.workExperienceService.findAll();
    }
  
    /**
     * Obtiene una experiencia laboral por su ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Obtener una experiencia laboral por ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Experiencia laboral encontrada',
      type: WorkExperienceResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Experiencia laboral no encontrada',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID de la experiencia laboral' })
    async findById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<WorkExperienceResponseDto> {
      return this.workExperienceService.findById(id);
    }
  
    /**
     * Obtiene todas las experiencias laborales de un usuario por su ID
     */
    @Get('user/:userId')
    @ApiOperation({ summary: 'Obtener todas las experiencias laborales de un usuario por su ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de experiencias laborales del usuario obtenida correctamente',
      type: [WorkExperienceResponseDto],
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuario no encontrado',
    })
    @ApiParam({ name: 'userId', type: String, description: 'ID del usuario' })
    async findByUserId(
      @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    ): Promise<WorkExperienceResponseDto[]> {
      return this.workExperienceService.findByUserId(userId);
    }
  
    /**
     * Crea una nueva experiencia laboral
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva experiencia laboral' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Experiencia laboral creada correctamente',
      type: WorkExperienceResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos inválidos',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuario no encontrado',
    })
    async create(
      @Body() createDto: CreateWorkExperienceDto,
    ): Promise<WorkExperienceResponseDto> {
      return this.workExperienceService.create(createDto);
    }
  
    /**
     * Actualiza una experiencia laboral existente
     */
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una experiencia laboral' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Experiencia laboral actualizada correctamente',
      type: WorkExperienceResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Experiencia laboral no encontrada',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos inválidos',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID de la experiencia laboral' })
    async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateDto: UpdateWorkExperienceDto,
    ): Promise<WorkExperienceResponseDto> {
      return this.workExperienceService.update(id, updateDto);
    }
  
    /**
     * Elimina una experiencia laboral
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una experiencia laboral' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Experiencia laboral eliminada correctamente',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Experiencia laboral no encontrada',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID de la experiencia laboral' })
    async delete(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<void> {
      await this.workExperienceService.delete(id);
    }
  }