import { 
    IsString, 
    IsOptional, 
    IsBoolean, 
    IsArray, 
    IsInt, 
    Min, 
    IsIn, 
    ArrayMinSize,
    IsNotEmpty
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
  import { Transform, Type } from 'class-transformer';
  import { ApplicationResponseDto } from '../applications/application.dto';
  
  /**
   * DTO para crear una vacante
   */
  export class CreateVacancyDto {
    @ApiProperty({
      description: 'Título del puesto de trabajo',
      example: 'Desarrollador Full Stack',
    })
    @IsString({ message: 'El título debe ser un texto' })
    @IsNotEmpty({ message: 'El título es requerido' })
    jobTitle: string;
  
    @ApiPropertyOptional({
      description: 'Slug para la URL de la vacante (si no se proporciona, se generará a partir del título)',
      example: 'desarrollador-full-stack',
    })
    @IsString({ message: 'El slug debe ser un texto' })
    @IsOptional()
    slug?: string;
  
    @ApiProperty({
      description: 'Modalidad de trabajo',
      example: 'Remoto',
      enum: ['Remoto', 'Presencial', 'Híbrido'],
    })
    @IsString({ message: 'La modalidad debe ser un texto' })
    @IsIn(['Remoto', 'Presencial', 'Híbrido'], { message: 'La modalidad debe ser Remoto, Presencial o Híbrido' })
    mode: string;
  
    @ApiProperty({
      description: 'Años de experiencia requeridos',
      example: 3,
    })
    @IsInt({ message: 'Los años de experiencia deben ser un número entero' })
    @Min(0, { message: 'Los años de experiencia no pueden ser negativos' })
    yearsExperience: number;
  
    @ApiProperty({
      description: 'Descripción corta de la vacante',
      example: 'Buscamos desarrollador con experiencia en React y Node.js',
    })
    @IsString({ message: 'La descripción corta debe ser un texto' })
    shortDescription: string;
  
    @ApiProperty({
      description: 'Descripción detallada de la vacante',
      example: 'Empresa líder en el sector tecnológico busca desarrollador full stack...',
    })
    @IsString({ message: 'La descripción debe ser un texto' })
    description: string;
  
    @ApiProperty({
      description: 'Tecnologías requeridas',
      example: ['React', 'Node.js', 'TypeScript'],
      type: [String],
    })
    @IsArray({ message: 'Las tecnologías requeridas deben ser un array' })
    @ArrayMinSize(1, { message: 'Debe incluir al menos una tecnología requerida' })
    @IsString({ each: true, message: 'Cada tecnología debe ser un texto' })
    stackRequired: string[];
  
    @ApiPropertyOptional({
      description: 'Indica si la vacante está activa',
      example: true,
      default: true,
    })
    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    isActive?: boolean;
  
    @ApiPropertyOptional({
      description: 'Estado de la vacante',
      example: 'open',
      enum: ['open', 'closed', 'on_hold'],
      default: 'open',
    })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['open', 'closed', 'on_hold'], { message: 'El estado debe ser open, closed o on_hold' })
    @IsOptional()
    status?: string;
  }
  
  /**
   * DTO para actualizar una vacante
   */
  export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {}
  
  /**
   * DTO para filtrar vacantes
   */
  export class FilterVacancyDto {
    @ApiPropertyOptional({
      description: 'Filtrar por estado activo/inactivo',
      example: true,
    })
    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    @Transform(({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    })
    isActive?: boolean;
  
    @ApiPropertyOptional({
      description: 'Filtrar por estado de la vacante',
      example: 'open',
      enum: ['open', 'closed', 'on_hold'],
    })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['open', 'closed', 'on_hold'], { message: 'El estado debe ser open, closed o on_hold' })
    @IsOptional()
    status?: string;
  
    @ApiPropertyOptional({
      description: 'Búsqueda por título, descripción o tecnologías requeridas',
      example: 'react',
    })
    @IsString({ message: 'El término de búsqueda debe ser un texto' })
    @IsOptional()
    search?: string;
  
    @ApiPropertyOptional({
      description: 'Filtrar por modalidad de trabajo',
      example: 'Remoto',
      enum: ['Remoto', 'Presencial', 'Híbrido'],
    })
    @IsString({ message: 'La modalidad debe ser un texto' })
    @IsIn(['Remoto', 'Presencial', 'Híbrido'], { message: 'La modalidad debe ser Remoto, Presencial o Híbrido' })
    @IsOptional()
    mode?: string;
  }
  
  /**
   * DTO para la respuesta de vacante
   */
  export class VacancyResponseDto {
    @ApiProperty({
      description: 'ID único de la vacante',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;
  
    @ApiProperty({
      description: 'Título del puesto de trabajo',
      example: 'Desarrollador Full Stack',
    })
    jobTitle: string;
  
    @ApiProperty({
      description: 'Slug para la URL de la vacante',
      example: 'desarrollador-full-stack',
    })
    slug: string;
  
    @ApiProperty({
      description: 'Modalidad de trabajo',
      example: 'Remoto',
    })
    mode: string;
  
    @ApiProperty({
      description: 'Años de experiencia requeridos',
      example: 3,
    })
    yearsExperience: number;
  
    @ApiProperty({
      description: 'Descripción corta de la vacante',
      example: 'Buscamos desarrollador con experiencia en React y Node.js',
    })
    shortDescription: string;
  
    @ApiProperty({
      description: 'Descripción detallada de la vacante',
      example: 'Empresa líder en el sector tecnológico busca desarrollador full stack...',
    })
    description: string;
  
    @ApiProperty({
      description: 'Tecnologías requeridas',
      example: ['React', 'Node.js', 'TypeScript'],
      type: [String],
    })
    stackRequired: string[];
  
    @ApiProperty({
      description: 'Indica si la vacante está activa',
      example: true,
    })
    isActive: boolean;
  
    @ApiProperty({
      description: 'Estado de la vacante',
      example: 'open',
    })
    status: string;
  
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
  
    @ApiPropertyOptional({
      description: 'Aplicaciones a esta vacante',
      type: [ApplicationResponseDto],
    })
    @Type(() => ApplicationResponseDto)
    applications?: ApplicationResponseDto[];
  
    constructor(partial: Partial<VacancyResponseDto>) {
      Object.assign(this, partial);
    }
  }