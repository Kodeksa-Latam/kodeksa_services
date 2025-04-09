import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite de resultados por página' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo/inactivo' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Búsqueda por email' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Lista de usuarios paginada',
    type: Promise<PaginatedResult<UserResponseDto>>
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<UserResponseDto>> {
    return this.userService.findAll({
      page,
      limit,
      isActive,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Usuario encontrado',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado'
  })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener un usuario por su slug' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Usuario encontrado',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado'
  })
  async findBySlug(@Param('slug') slug: string): Promise<UserResponseDto> {
    return this.userService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ 
    status: HttpStatus.CREATED,
    description: 'Usuario creado correctamente',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT,
    description: 'El email ya está registrado'
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Usuario actualizado correctamente',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT,
    description: 'El email ya está en uso por otro usuario'
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario (borrado lógico)' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Usuario eliminado correctamente',
    type: Boolean
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado'
  })
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.userService.delete(id);
  }
}