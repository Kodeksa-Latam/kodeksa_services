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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SolutionService } from './solution.service';
import {
  CreateSolutionDto,
  UpdateSolutionDto,
  SolutionResponseDto,
  CreateFeatureDto,
  UpdateFeatureDto,
  FeatureResponseDto,
  CreateFeatureInSolutionDto
} from './solution.dto';
import { SOLUTIONS_ROUTES } from './constants/routes.constants';

/**
 * Controlador de Soluciones
 * 
 * Implementa endpoints para gestionar soluciones y sus características.
 */
@ApiTags('Solutions')
@Controller(SOLUTIONS_ROUTES.BASE)
@UseInterceptors(ClassSerializerInterceptor)
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) { }

  /**
   * Obtiene todas las soluciones activas (siempre incluye características)
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las soluciones activas con sus características' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de soluciones activas obtenida correctamente',
    type: [SolutionResponseDto],
  })
  async findAll(): Promise<SolutionResponseDto[]> {
    return this.solutionService.findAll();
  }

  /**
   * Obtiene todas las soluciones (incluso inactivas) - para administración
   * Siempre incluye características
   */
  @Get('admin')
  @ApiOperation({ summary: 'Obtener todas las soluciones (incluso inactivas) con sus características - Admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de todas las soluciones obtenida correctamente',
    type: [SolutionResponseDto],
  })
  async findAllAdmin(): Promise<SolutionResponseDto[]> {
    return this.solutionService.findAllAdmin();
  }

  /**
   * Obtiene una solución por su ID (siempre incluye características)
   */
  @Get(SOLUTIONS_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Obtener una solución por su ID con sus características' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la solución',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Solución obtenida correctamente',
    type: SolutionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Solución no encontrada',
  })
  async findById(@Param('id') id: string): Promise<SolutionResponseDto> {
    return this.solutionService.findById(id);
  }

  /**
   * Crea una nueva solución
   */
  @Post()
  @ApiOperation({ summary: 'Crear una nueva solución' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Solución creada correctamente',
    type: SolutionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createDto: CreateSolutionDto): Promise<SolutionResponseDto> {
    return this.solutionService.create(createDto);
  }

  /**
   * Actualiza una solución existente
   */
  @Put(SOLUTIONS_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Actualizar una solución existente' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la solución',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Solución actualizada correctamente',
    type: SolutionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Solución no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSolutionDto
  ): Promise<SolutionResponseDto> {
    return this.solutionService.update(id, updateDto);
  }

  /**
   * Elimina una solución
   */
  @Delete(SOLUTIONS_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Eliminar una solución' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la solución',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Solución eliminada correctamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Solución no encontrada',
  })
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.solutionService.delete(id);
  }

  /**
   * Crea una nueva característica para una solución y devuelve la solución actualizada
   */
  @Post(`${SOLUTIONS_ROUTES.BY_ID}/features`)
  @ApiOperation({ summary: 'Crear una nueva característica para una solución' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la solución',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Característica creada y solución actualizada correctamente',
    type: SolutionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Solución no encontrada',
  })
  async addFeatureToSolution(
    @Param('id') solutionId: string,
    @Body() createFeatureDto: CreateFeatureInSolutionDto
  ): Promise<SolutionResponseDto> {
    // Asegurarse de que el ID de la solución en el DTO coincida con el de la ruta

    const createDto: CreateFeatureDto = {
      ...createFeatureDto,
      solutionId: solutionId
    }

    // Crear la característica
    await this.solutionService.createFeature(createDto);

    // Devolver la solución actualizada con todas sus características
    return this.solutionService.findById(solutionId);
  }

  /**
   * Elimina una característica de una solución y devuelve la solución actualizada
   */
  @Delete(`${SOLUTIONS_ROUTES.BY_ID}/features/:featureId`)
  @ApiOperation({ summary: 'Eliminar una característica de una solución' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la solución',
  })
  @ApiParam({
    name: 'featureId',
    required: true,
    description: 'ID de la característica',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Característica eliminada y solución actualizada correctamente',
    type: SolutionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Solución o característica no encontrada',
  })
  async removeFeatureFromSolution(
    @Param('id') solutionId: string,
    @Param('featureId') featureId: string
  ): Promise<SolutionResponseDto> {
    // Eliminar la característica
    await this.solutionService.deleteFeature(featureId);

    // Devolver la solución actualizada
    return this.solutionService.findById(solutionId);
  }
}