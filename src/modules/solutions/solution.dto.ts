import { 
  IsString, 
  IsBoolean, 
  IsOptional, 
  IsUUID, 
  IsInt, 
  Min,
  ArrayMinSize,
  ValidateNested
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO para crear una característica
 */
export class CreateFeatureDto {
  @ApiProperty({
    description: 'ID de la solución a la que pertenece esta característica',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de la solución debe ser un UUID válido' })
  solutionId: string;

  @ApiProperty({
    description: 'Descripción de la característica',
    example: 'Integración continua automatizada',
  })
  @IsString({ message: 'La descripción de la característica debe ser un texto' })
  featureDescription: string;

  @ApiPropertyOptional({
    description: 'Indica si la característica está activa',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  @IsOptional()
  isActive?: boolean;
}

export class CreateFeatureInSolutionDto {
  @ApiProperty({
    description: 'Descripción de la característica',
    example: 'Integración continua automatizada',
  })
  @IsString({ message: 'La descripción de la característica debe ser un texto' })
  featureDescription: string;

  @ApiPropertyOptional({
    description: 'Indica si la característica está activa',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  @IsOptional()
  isActive?: boolean;
}

/**
 * DTO para actualizar una característica
 */
export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {}

/**
 * DTO para la respuesta de característica
 */
export class FeatureResponseDto {
  @ApiProperty({
    description: 'ID único de la característica',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la solución a la que pertenece esta característica',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  solutionId: string;

  @ApiProperty({
    description: 'Descripción de la característica',
    example: 'Integración continua automatizada',
  })
  featureDescription: string;

  @ApiProperty({
    description: 'Indica si la característica está activa',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<FeatureResponseDto>) {
    Object.assign(this, partial);
  }
}

/**
 * DTO para crear una solución
 */
export class CreateSolutionDto {
  @ApiProperty({
    description: 'Título de la solución',
    example: 'Desarrollo Web',
  })
  @IsString({ message: 'El título debe ser un texto' })
  title: string;

  @ApiProperty({
    description: 'Icono de la solución (nombre o código)',
    example: 'code-bracket',
  })
  @IsString({ message: 'El icono debe ser un texto' })
  icon: string;

  @ApiProperty({
    description: 'Descripción de la solución',
    example: 'Desarrollo de aplicaciones web modernas y escalables.',
  })
  @IsString({ message: 'La descripción debe ser un texto' })
  description: string;

  @ApiPropertyOptional({
    description: 'Indica si la solución está activa',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Orden de visualización',
    example: 1,
    default: 0,
  })
  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(0, { message: 'El orden no puede ser negativo' })
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({
    description: 'Características de la solución',
    type: [CreateFeatureInSolutionDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureInSolutionDto)
  @ArrayMinSize(0)
  features?: CreateFeatureInSolutionDto[];
}

/**
 * DTO para actualizar una solución
 */
export class UpdateSolutionDto extends PartialType(CreateSolutionDto) {}

/**
 * DTO para la respuesta de solución
 */
export class SolutionResponseDto {
  @ApiProperty({
    description: 'ID único de la solución',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Título de la solución',
    example: 'Desarrollo Web',
  })
  title: string;

  @ApiProperty({
    description: 'Icono de la solución (nombre o código)',
    example: 'code-bracket',
  })
  icon: string;

  @ApiProperty({
    description: 'Descripción de la solución',
    example: 'Desarrollo de aplicaciones web modernas y escalables.',
  })
  description: string;

  @ApiProperty({
    description: 'Indica si la solución está activa',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Orden de visualización',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Características de la solución',
    type: [FeatureResponseDto],
    default: [],
  })
  features: FeatureResponseDto[] = [];

  constructor(partial: Partial<SolutionResponseDto>) {
    Object.assign(this, partial);
  }
}