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
import { CardConfigurationService } from './card-configuration.service';
import { 
  CreateCardConfigurationDto, 
  UpdateCardConfigurationDto, 
  CardConfigurationResponseDto 
} from './card-configuration.dto';

/**
 * Controlador de Configuraciones de Tarjeta
 * 
 * Gestiona las peticiones HTTP relacionadas con configuraciones de tarjeta.
 * Implementa los endpoints para el CRUD.
 */
@ApiTags('card-configurations')
@Controller('card-configurations')
export class CardConfigurationController {
  constructor(private readonly cardConfigService: CardConfigurationService) {}

  /**
   * Obtiene una configuración de tarjeta por su ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una configuración de tarjeta por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuración encontrada',
    type: CardConfigurationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Configuración no encontrada',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID de la configuración' })
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CardConfigurationResponseDto> {
    return this.cardConfigService.findById(id);
  }

  /**
   * Obtiene una configuración de tarjeta por el ID del usuario
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener una configuración de tarjeta por ID de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuración encontrada',
    type: CardConfigurationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Configuración no encontrada',
  })
  @ApiParam({ name: 'userId', type: String, description: 'ID del usuario' })
  async findByUserId(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ): Promise<CardConfigurationResponseDto> {
    return this.cardConfigService.findByUserId(userId);
  }

  /**
   * Crea una nueva configuración de tarjeta
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva configuración de tarjeta' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Configuración creada correctamente',
    type: CardConfigurationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe una configuración para este usuario',
  })
  async create(
    @Body() createDto: CreateCardConfigurationDto,
  ): Promise<CardConfigurationResponseDto> {
    return this.cardConfigService.create(createDto);
  }

  /**
   * Actualiza una configuración de tarjeta existente
   */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una configuración de tarjeta' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuración actualizada correctamente',
    type: CardConfigurationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Configuración no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID de la configuración' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateCardConfigurationDto,
  ): Promise<CardConfigurationResponseDto> {
    return this.cardConfigService.update(id, updateDto);
  }

  /**
   * Elimina una configuración de tarjeta
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una configuración de tarjeta' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Configuración eliminada correctamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Configuración no encontrada',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID de la configuración' })
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.cardConfigService.delete(id);
  }

  /**
   * Restablece una configuración de tarjeta a los valores predeterminados
   */
  @Put(':id/reset')
  @ApiOperation({ summary: 'Restablecer una configuración de tarjeta a los valores predeterminados' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuración restablecida correctamente',
    type: CardConfigurationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Configuración no encontrada',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID de la configuración' })
  async reset(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CardConfigurationResponseDto> {
    return this.cardConfigService.reset(id);
  }
}