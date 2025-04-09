import { IsString, IsEmail, IsOptional, MinLength, Matches, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para actualizar un usuario
 * 
 * Define la estructura de datos esperada para actualizar un usuario.
 * Todos los campos son opcionales.
 */
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'El email del usuario (debe ser único)',
    example: 'nuevo.email@ejemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'El nombre del usuario',
    example: 'Nuevo Nombre',
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'El apellido del usuario',
    example: 'Nuevo Apellido',
  })
  @IsString({ message: 'El apellido debe ser un texto' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'La contraseña del usuario (mínimo 8 caracteres, debe incluir mayúsculas, minúsculas y números)',
    example: 'NuevoPassword123',
  })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsOptional()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  password?: string;
  
  @ApiPropertyOptional({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
  })
  @IsBoolean({ message: 'El estado debe ser un booleano (true/false)' })
  @IsOptional()
  isActive?: boolean;
}