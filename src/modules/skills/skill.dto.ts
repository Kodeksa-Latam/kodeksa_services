import { IsString, IsOptional, IsUUID, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

/**
 * DTO para crear una habilidad
 */
export class CreateSkillDto {
  @ApiProperty({
    description: 'ID del usuario al que pertenece esta habilidad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
  userId: string;

  @ApiProperty({
    description: 'Nombre de la habilidad',
    example: 'JavaScript',
  })
  @IsString({ message: 'El nombre de la habilidad debe ser un texto' })
  skillName: string;

  @ApiPropertyOptional({
    description: 'URL del certificado que acredita la habilidad',
    example: 'https://example.com/certificates/javascript-advanced.pdf',
  })
  @IsUrl({}, { message: 'La URL debe tener un formato válido' })
  @IsOptional()
  urlCertificate?: string;
}

/**
 * DTO para actualizar una habilidad
 */
export class UpdateSkillDto extends PartialType(CreateSkillDto) {}

/**
 * DTO para la respuesta de habilidad
 */
export class SkillResponseDto {
  @ApiProperty({
    description: 'ID único de la habilidad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario al que pertenece esta habilidad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Nombre de la habilidad',
    example: 'JavaScript',
  })
  skillName: string;

  @ApiPropertyOptional({
    description: 'URL del certificado que acredita la habilidad',
    example: 'https://example.com/certificates/javascript-advanced.pdf',
  })
  urlCertificate?: string;

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

  constructor(partial: Partial<SkillResponseDto>) {
    Object.assign(this, partial);
  }
}