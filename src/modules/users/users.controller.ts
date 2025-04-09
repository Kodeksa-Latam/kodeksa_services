import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpStatus,
    HttpCode,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseUUIDPipe,
  } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';

/**
 * Controlador de Usuarios
 * 
 * Gestiona las peticiones HTTP relacionadas con usuarios.
 * Implementa los endpoints para el CRUD.
 */

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor) // Para aplicar @Exclude/@Expose en DTOs
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    /**
     * Obtiene todos los usuarios con paginación
     */
    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de usuarios paginada',
      type: [UserResponseDto],
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Buscar por email' })
    async findAll(
      @Query() paginationDto: PaginationDto,
      @Query('isActive') isActive?: boolean,
      @Query('search') search?: string,
    ): Promise<PaginatedResult<UserResponseDto>> {
      const result = await this.usersService.findAll({
        page: paginationDto.page!,
        limit: paginationDto.limit!,
        isActive,
        search,
      });
  
      // Transformar los resultados al DTO de respuesta
      return {
        items: result.items.map(user => UserResponseDto.fromDomain(user)),
        meta: result.meta,
      };
    }
  
    /**
     * Obtiene un usuario por su ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Obtener un usuario por ID' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Usuario encontrado',
      type: UserResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuario no encontrado',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID del usuario' })
    async findById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<UserResponseDto> {
      const user = await this.usersService.findById(id);
      return UserResponseDto.fromDomain(user);
    }
  
    /**
     * Crea un nuevo usuario
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Usuario creado correctamente',
      type: UserResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos inválidos',
    })
    @ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Email ya registrado',
    })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
      const user = await this.usersService.create(createUserDto);
      return UserResponseDto.fromDomain(user);
    }
  
    /**
     * Actualiza un usuario existente
     */
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Usuario actualizado correctamente',
      type: UserResponseDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuario no encontrado',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Datos inválidos',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID del usuario' })
    async update(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
      const user = await this.usersService.update(id, updateUserDto);
      return UserResponseDto.fromDomain(user);
    }
  
    /**
     * Elimina un usuario
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Usuario eliminado correctamente',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Usuario no encontrado',
    })
    @ApiParam({ name: 'id', type: String, description: 'ID del usuario' })
    async delete(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ): Promise<void> {
      await this.usersService.delete(id);
    }
  }