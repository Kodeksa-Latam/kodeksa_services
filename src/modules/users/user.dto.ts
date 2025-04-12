import { IsString, IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {  Expose, Transform, Type } from 'class-transformer';
import { CardConfigurationResponseDto } from '../card-configurations/card-configuration.dto';
import { IsValidEmail } from '../../common/decorators/validation.decorator';
import { CurriculumResponseDto } from '../curriculums/curriculum.dto';
import { SkillResponseDto } from '../skills/skill.dto';
import { WorkExperienceResponseDto } from '../work-experiences/work-experience.dto';

/**
 * DTO para crear un usuario
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsString({ message: 'El apellido debe ser un texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @ApiProperty({
    description: 'Email del usuario (debe ser único)',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsValidEmail({ message: 'El formato del email no es válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  // @ApiProperty({
  //   description: 'Contraseña del usuario (mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números)',
  //   example: 'Password123',
  // })
  // @IsString({ message: 'La contraseña debe ser un texto' })
  // @IsNotEmpty({ message: 'La contraseña es requerida' })
  // @IsStrongPassword({ message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número' })
  // password: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario',
    example: 'admin',
    default: 'user'
  })
  @IsString({ message: 'El rol debe ser un texto' })
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    description: 'Slug para el perfil público del usuario',
    example: 'juan-perez'
  })
  @IsString({ message: 'El slug debe ser un texto' })
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de perfil',
    example: 'https://example.com/images/profile.jpg'
  })
  @IsString({ message: 'La imagen debe ser un texto' })
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Indica si se debe mostrar el currículum',
    example: false,
    default: false
  })
  @IsBoolean({ message: 'El valor debe ser booleano (true/false)' })
  @IsOptional()
  showCurriculum?: boolean;
}

/**
 * DTO para actualizar un usuario
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}

/**
 * DTO para la respuesta de usuario
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @Expose()
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  fullName: string;

  @ApiProperty({
    description: 'Estado del usuario',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Rol del usuario',
    example: 'admin',
  })
  role: string;

  @ApiPropertyOptional({
    description: 'Slug del perfil del usuario',
    example: 'juan-perez',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de perfil',
    example: 'https://example.com/images/profile.jpg',
  })
  image: string;

  @ApiPropertyOptional({
    description: 'Indica si se muestra el currículum',
    example: true,
  })
  showCurriculum: boolean;

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
    description: 'Configuración de tarjeta del usuario',
    type: () => CardConfigurationResponseDto,
  })
  @Type(() => CardConfigurationResponseDto)
  cardConfiguration?: CardConfigurationResponseDto;

  @ApiPropertyOptional({
    description: 'Currículum del usuario',
    type: () => CurriculumResponseDto,
  })
  @Type(() => CurriculumResponseDto)
  curriculum?: CurriculumResponseDto;

  @ApiPropertyOptional({
    description: 'Habilidades del usuario',
    type: () => [SkillResponseDto],
  })
  @Type(() => SkillResponseDto)
  skills?: SkillResponseDto[] = [];

  @ApiPropertyOptional({
    description: 'Experiencias laborales del usuario',
    type: () => [WorkExperienceResponseDto],
  })
  @Type(() => WorkExperienceResponseDto)
  workExperiences?: WorkExperienceResponseDto[] = [];

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}