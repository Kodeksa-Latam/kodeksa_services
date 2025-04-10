import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO para crear una experiencia laboral
 */
export class CreateWorkExperienceDto {
  @ApiProperty({
    description: 'ID del usuario al que pertenece esta experiencia laboral',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
  userId: string;

  @ApiProperty({
    description: 'Rol o puesto desempeñado',
    example: 'Desarrollador Full-Stack',
  })
  @IsString({ message: 'El rol debe ser un texto' })
  role: string;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'TechCorp Inc.',
  })
  @IsString({ message: 'El nombre de la empresa debe ser un texto' })
  companyName: string;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2020-01-01',
  })
  @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido' })
  fromYear: Date;

  @ApiPropertyOptional({
    description: 'Fecha de fin (si ya no trabaja ahí)',
    example: '2022-01-01',
  })
  @IsDateString({}, { message: 'La fecha de fin debe tener un formato válido' })
  @IsOptional()
  untilYear?: Date;

  @ApiPropertyOptional({
    description: 'Descripción de las responsabilidades y logros en el puesto',
    example: 'Desarrollo de aplicaciones web utilizando React y Node.js. Implementación de CI/CD con GitHub Actions.',
  })
  @IsString({ message: 'La descripción del rol debe ser un texto' })
  @IsOptional()
  roleDescription?: string;
}

/**
 * DTO para actualizar una experiencia laboral
 */
export class UpdateWorkExperienceDto extends PartialType(CreateWorkExperienceDto) {}

/**
 * DTO para la respuesta de experiencia laboral
 */
export class WorkExperienceResponseDto {
  @ApiProperty({
    description: 'ID único de la experiencia laboral',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario al que pertenece esta experiencia laboral',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Rol o puesto desempeñado',
    example: 'Desarrollador Full-Stack',
  })
  role: string;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'TechCorp Inc.',
  })
  companyName: string;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2020-01-01T00:00:00.000Z',
  })
  @Type(() => Date)
  fromYear: Date;

  @ApiPropertyOptional({
    description: 'Fecha de fin (si ya no trabaja ahí)',
    example: '2022-01-01T00:00:00.000Z',
  })
  @Type(() => Date)
  untilYear?: Date;

  @ApiPropertyOptional({
    description: 'Descripción de las responsabilidades y logros en el puesto',
    example: 'Desarrollo de aplicaciones web utilizando React y Node.js. Implementación de CI/CD con GitHub Actions.',
  })
  roleDescription?: string;

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

  constructor(partial: Partial<WorkExperienceResponseDto>) {
    Object.assign(this, partial);
  }
}