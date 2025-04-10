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
  import { CurriculumService } from './curriculum.service';
  import { 
    CreateCurriculumDto, 
    UpdateCurriculumDto, 
    CurriculumResponseDto 
  } from './curriculum.dto';
  import { CURRICULUM_ROUTES } from './constants/routes.constants';
  
  /**
   * Controlador de Currículums
   * 
   * Gestiona las peticiones HTTP relacionadas con currículums.
   * Implementa los endpoints para el CRUD.
   */
  @ApiTags('curriculums')
  @Controller(CURRICULUM_ROUTES.BASE)
  export class CurriculumController {
    constructor(private readonly curriculumService: CurriculumService) {}
  
    /**
     * Obtiene un currículum por su ID
     */
    @Get(CURRICULUM_ROUTES.GET_BY_ID)
    @ApiOperation({ summary: 'Obtener un currículum por ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Currículum encontrado',
      type: CurriculumResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Currículum no encontrado',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID del currículum' })
    async findById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<CurriculumResponseDto> {
      return this.curriculumService.findById(id);
    }
  
    /**
     * Obtiene un currículum por el ID del usuario
     */
    @Get(CURRICULUM_ROUTES.GET_BY_USER_ID)
    @ApiOperation({ summary: 'Obtener un currículum por ID de usuario' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Currículum encontrado',
      type: CurriculumResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Currículum no encontrado',
    })
    @ApiParam({ name: 'userId', type: String, description: 'ID del usuario' })
    async findByUserId(
      @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    ): Promise<CurriculumResponseDto> {
      return this.curriculumService.findByUserId(userId);
    }
  
    /**
     * Crea un nuevo currículum
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo currículum' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Currículum creado correctamente',
      type: CurriculumResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos inválidos',
    })
    @ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Ya existe un currículum para este usuario',
    })
    async create(
      @Body() createDto: CreateCurriculumDto,
    ): Promise<CurriculumResponseDto> {
      return this.curriculumService.create(createDto);
    }
  
    /**
     * Actualiza un currículum existente
     */
    @Put(CURRICULUM_ROUTES.UPDATE)
    @ApiOperation({ summary: 'Actualizar un currículum' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Currículum actualizado correctamente',
      type: CurriculumResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Currículum no encontrado',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos inválidos',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID del currículum' })
    async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateDto: UpdateCurriculumDto,
    ): Promise<CurriculumResponseDto> {
      return this.curriculumService.update(id, updateDto);
    }
  
    /**
     * Elimina un currículum
     */
    @Delete(CURRICULUM_ROUTES.DELETE)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar un currículum' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Currículum eliminado correctamente',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Currículum no encontrado',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID del currículum' })
    async delete(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<void> {
      await this.curriculumService.delete(id);
    }
  
    /**
     * Crea o actualiza un currículum
     * Si el usuario ya tiene un currículum, lo actualiza
     * Si no tiene, crea uno nuevo
     */
    @Post('create-or-update')
    @ApiOperation({ summary: 'Crear o actualizar un currículum' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Currículum creado o actualizado correctamente',
      type: CurriculumResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos inválidos',
    })
    async createOrUpdate(
      @Body() createDto: CreateCurriculumDto,
    ): Promise<CurriculumResponseDto> {
      return this.curriculumService.createOrUpdate(createDto);
    }

}