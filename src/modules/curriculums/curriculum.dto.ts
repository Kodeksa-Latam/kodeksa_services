import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

/**
 * DTO para crear un currículum
 */
export class CreateCurriculumDto {
  @ApiProperty({
    description: 'ID del usuario al que pertenece este currículum',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
  userId: string;

  @ApiPropertyOptional({
    description: 'Descripción sobre el usuario',
    example: 'Desarrollador fullstack con experiencia en NestJS y React',
  })
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  aboutMe?: string;

  @ApiPropertyOptional({
    description: 'Identificador de GitHub (slug)',
    example: 'johndoe',
  })
  @IsString({ message: 'El slug de GitHub debe ser un texto' })
  @IsOptional()
  githubSlug?: string;

  @ApiPropertyOptional({
    description: 'Identificador de LinkedIn (slug)',
    example: 'john-doe',
  })
  @IsString({ message: 'El slug de LinkedIn debe ser un texto' })
  @IsOptional()
  linkedinSlug?: string;
}

/**
 * DTO para actualizar un currículum
 */
export class UpdateCurriculumDto extends PartialType(CreateCurriculumDto) {
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
  @IsOptional()
  userId?: string;
}

/**
 * DTO para la respuesta de currículum
 */
export class CurriculumResponseDto {
  @ApiProperty({
    description: 'ID único del currículum',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario al que pertenece este currículum',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Descripción sobre el usuario',
    example: 'Desarrollador fullstack con experiencia en NestJS y React',
  })
  aboutMe: string;

  @ApiPropertyOptional({
    description: 'Identificador de GitHub (slug)',
    example: 'johndoe',
  })
  githubSlug: string;

  @ApiPropertyOptional({
    description: 'Identificador de LinkedIn (slug)',
    example: 'john-doe',
  })
  linkedinSlug: string;

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

  constructor(partial: Partial<CurriculumResponseDto>) {
    Object.assign(this, partial);
  }
}