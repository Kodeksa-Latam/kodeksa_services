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
    HttpStatus,
    HttpCode,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
  import { BlogService } from './blog.service';
  import { 
    CreateBlogDto, 
    UpdateBlogDto, 
    BlogResponseDto 
  } from './dto/blog.dto';
  import { 
    CreateBlogSectionDto, 
    UpdateBlogSectionDto, 
    BlogSectionResponseDto 
  } from './dto/blog-section.dto';
  import { PaginatedResult } from '../../common/dto/pagination.dto';
  import { BLOGS_ROUTES } from './constants/routes.constants';
  
  /**
   * Controlador de Blogs
   * 
   * Implementa los endpoints para la gestión de blogs y sus secciones.
   */
  @ApiTags('Blogs')
  @Controller(BLOGS_ROUTES.BASE)
  export class BlogController {
    constructor(private readonly blogService: BlogService) {}
  
    /**
     * Obtiene todos los blogs con paginación y filtros
     */
    @Get()
    @ApiOperation({ summary: 'Obtener todos los blogs con paginación y filtros' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de elementos por página' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo/inactivo' })
    @ApiQuery({ name: 'category', required: false, type: String, description: 'Filtrar por categoría' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Búsqueda por título o descripción' })
    @ApiQuery({ name: 'includeSections', required: false, type: Boolean, description: 'Incluir secciones en la respuesta' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista paginada de blogs',
      type: Promise<PaginatedResult<BlogResponseDto>>,
    })
    async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('isActive') isActive?: boolean,
      @Query('category') category?: string,
      @Query('search') search?: string,
      @Query('includeSections') includeSections?: boolean,
    ): Promise<PaginatedResult<BlogResponseDto>> {
      return this.blogService.findAll({
        page,
        limit,
        isActive,
        category,
        search,
        includeSections,
      });
    }
  
    /**
     * Obtiene un blog por su ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Obtener un blog por su ID' })
    @ApiParam({ name: 'id', description: 'ID del blog' })
    @ApiQuery({ name: 'includeSections', required: false, type: Boolean, description: 'Incluir secciones en la respuesta' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Blog encontrado',
      type: BlogResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog no encontrado',
    })
    async findById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Query('includeSections') includeSections?: boolean,
    ): Promise<BlogResponseDto> {
      return this.blogService.findById(id, includeSections);
    }
  
    /**
     * Obtiene un blog por su slug
     */
    @Get('slug/:slug')
    @ApiOperation({ summary: 'Obtener un blog por su slug' })
    @ApiParam({ name: 'slug', description: 'Slug del blog' })
    @ApiQuery({ name: 'includeSections', required: false, type: Boolean, description: 'Incluir secciones en la respuesta' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Blog encontrado',
      type: BlogResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog no encontrado',
    })
    async findBySlug(
      @Param('slug') slug: string,
      @Query('includeSections') includeSections?: boolean,
    ): Promise<BlogResponseDto> {
      return this.blogService.findBySlug(slug, includeSections);
    }
  
    /**
     * Obtiene todos los blogs de un usuario
     */
    @Get('user/:userId')
    @ApiOperation({ summary: 'Obtener todos los blogs de un usuario' })
    @ApiParam({ name: 'userId', description: 'ID del usuario' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de elementos por página' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo/inactivo' })
    @ApiQuery({ name: 'includeSections', required: false, type: Boolean, description: 'Incluir secciones en la respuesta' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista paginada de blogs del usuario',
      type: Promise<PaginatedResult<BlogResponseDto>>,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuario no encontrado',
    })
    async findByUserId(
      @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('isActive') isActive?: boolean,
      @Query('includeSections') includeSections?: boolean,
    ): Promise<PaginatedResult<BlogResponseDto>> {
      return this.blogService.findByUserId(userId, {
        page,
        limit,
        isActive,
        includeSections,
      });
    }
  
    /**
     * Crea un nuevo blog
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo blog con sus secciones' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Blog creado con éxito',
      type: BlogResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuario no encontrado',
    })
    @ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'El slug ya existe',
    })
    async create(@Body() createDto: CreateBlogDto): Promise<BlogResponseDto> {
      return this.blogService.create(createDto);
    }
  
    /**
     * Actualiza un blog existente
     */
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un blog existente' })
    @ApiParam({ name: 'id', description: 'ID del blog' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Blog actualizado con éxito',
      type: BlogResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog no encontrado',
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
      @Body() updateDto: UpdateBlogDto,
    ): Promise<BlogResponseDto> {
      return this.blogService.update(id, updateDto);
    }
  
    /**
     * Elimina un blog
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar un blog' })
    @ApiParam({ name: 'id', description: 'ID del blog' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Blog eliminado con éxito',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog no encontrado',
    })
    async delete(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<void> {
      await this.blogService.delete(id);
    }
  
    /**
     * Crea una nueva sección para un blog
     */
    @Post(':blogId/sections')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una nueva sección para un blog' })
    @ApiParam({ name: 'blogId', description: 'ID del blog' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Sección creada con éxito',
      type: BlogSectionResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog no encontrado',
    })
    async createSection(
      @Param('blogId', new ParseUUIDPipe({ version: '4' })) blogId: string,
      @Body() createDto: CreateBlogSectionDto,
    ): Promise<BlogSectionResponseDto> {
      return this.blogService.createSection(blogId, createDto);
    }
  
    /**
     * Actualiza una sección de blog existente
     */
    @Put(':blogId/sections/:sectionId')
    @ApiOperation({ summary: 'Actualizar una sección de blog' })
    @ApiParam({ name: 'blogId', description: 'ID del blog' })
    @ApiParam({ name: 'sectionId', description: 'ID de la sección' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Sección actualizada con éxito',
      type: BlogSectionResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog o sección no encontrados',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    async updateSection(
      @Param('blogId', new ParseUUIDPipe({ version: '4' })) blogId: string,
      @Param('sectionId', new ParseUUIDPipe({ version: '4' })) sectionId: string,
      @Body() updateDto: UpdateBlogSectionDto,
    ): Promise<BlogSectionResponseDto> {
      // Validar que la sección pertenece al blog
      updateDto.blogId = blogId;
      return this.blogService.updateSection(sectionId, updateDto);
    }
  
    /**
     * Elimina una sección de blog
     */
    @Delete(':blogId/sections/:sectionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una sección de blog' })
    @ApiParam({ name: 'blogId', description: 'ID del blog' })
    @ApiParam({ name: 'sectionId', description: 'ID de la sección' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Sección eliminada con éxito',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog o sección no encontrados',
    })
    async deleteSection(
      @Param('blogId', new ParseUUIDPipe({ version: '4' })) blogId: string,
      @Param('sectionId', new ParseUUIDPipe({ version: '4' })) sectionId: string,
    ): Promise<void> {
      await this.blogService.deleteSection(sectionId);
    }
  
    /**
     * Reordena las secciones de un blog
     */
    @Patch(':blogId/sections/reorder')
    @ApiOperation({ summary: 'Reordenar las secciones de un blog' })
    @ApiParam({ name: 'blogId', description: 'ID del blog' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Secciones reordenadas con éxito',
      type: BlogResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Blog o secciones no encontrados',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos de entrada inválidos',
    })
    async reorderSections(
      @Param('blogId', new ParseUUIDPipe({ version: '4' })) blogId: string,
      @Body('sectionIds') sectionIds: string[],
    ): Promise<BlogResponseDto> {
      return this.blogService.reorderSections(blogId, sectionIds);
    }
}