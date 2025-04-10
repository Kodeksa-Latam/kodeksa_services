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
  import { SkillService } from './skill.service';
  import { CreateSkillDto, UpdateSkillDto, SkillResponseDto } from './skill.dto';
  import { SKILLS_ROUTES } from './constants/routes.constants';
  
  /**
   * Controlador de Habilidades
   * 
   * Gestiona las peticiones HTTP relacionadas con habilidades.
   * Implementa los endpoints para el CRUD.
   */
  @ApiTags('skills')
  @Controller(SKILLS_ROUTES.BASE)
  export class SkillController {
    constructor(private readonly skillService: SkillService) {}
  
    /**
     * Obtiene todas las habilidades
     */
    @Get()
    @ApiOperation({ summary: 'Obtener todas las habilidades' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de habilidades obtenida correctamente',
      type: [SkillResponseDto],
    })
    async findAll(): Promise<SkillResponseDto[]> {
      return this.skillService.findAll();
    }
  
    /**
     * Obtiene una habilidad por su ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Obtener una habilidad por ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Habilidad encontrada',
      type: SkillResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Habilidad no encontrada',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID de la habilidad' })
    async findById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<SkillResponseDto> {
      return this.skillService.findById(id);
    }
  
    /**
     * Obtiene todas las habilidades de un usuario por su ID
     */
    @Get('user/:userId')
    @ApiOperation({ summary: 'Obtener todas las habilidades de un usuario por su ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de habilidades del usuario obtenida correctamente',
      type: [SkillResponseDto],
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuario no encontrado',
    })
    @ApiParam({ name: 'userId', type: String, description: 'ID del usuario' })
    async findByUserId(
      @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    ): Promise<SkillResponseDto[]> {
      return this.skillService.findByUserId(userId);
    }
  
    /**
     * Crea una nueva habilidad
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva habilidad' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Habilidad creada correctamente',
      type: SkillResponseDto,
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
      @Body() createDto: CreateSkillDto,
    ): Promise<SkillResponseDto> {
      return this.skillService.create(createDto);
    }
  
    /**
     * Actualiza una habilidad existente
     */
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una habilidad' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Habilidad actualizada correctamente',
      type: SkillResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Habilidad no encontrada',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos inválidos',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID de la habilidad' })
    async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateDto: UpdateSkillDto,
    ): Promise<SkillResponseDto> {
      return this.skillService.update(id, updateDto);
    }
  
    /**
     * Elimina una habilidad
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una habilidad' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Habilidad eliminada correctamente',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Habilidad no encontrada',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID de la habilidad' })
    async delete(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<void> {
      await this.skillService.delete(id);
    }
  }