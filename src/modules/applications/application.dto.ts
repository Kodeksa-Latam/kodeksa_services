import { 
    IsString, 
    IsOptional, 
    IsBoolean, 
    IsEmail,
    IsUUID,
    IsUrl,
    IsIn,
    IsNotEmpty
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
  
  /**
   * DTO para crear una aplicación a una vacante
   */
  export class CreateApplicationDto {
    @ApiProperty({
      description: 'ID de la vacante a la que se aplica',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID('4', { message: 'El ID de vacante debe ser un UUID válido' })
    vacancyId: string;
  
    @ApiProperty({
      description: 'Nombre completo del aplicante',
      example: 'Juan Pérez',
    })
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;
  
    @ApiProperty({
      description: 'Email del aplicante',
      example: 'juan.perez@ejemplo.com',
    })
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    email: string;
  
    @ApiProperty({
      description: 'Número de teléfono del aplicante',
      example: '+34 600 123 456',
    })
    @IsString({ message: 'El teléfono debe ser un texto' })
    phone: string;
  
    @ApiPropertyOptional({
      description: 'Motivación o carta de presentación',
      example: 'Me interesa esta posición porque...',
    })
    @IsString({ message: 'La motivación debe ser un texto' })
    @IsOptional()
    applicationMotivation?: string;
  
    @ApiPropertyOptional({
      description: 'URL al currículum vitae',
      example: 'https://ejemplo.com/cv.pdf',
    })
    @IsUrl({}, { message: 'La URL del CV debe tener un formato válido' })
    @IsOptional()
    cvUrl?: string;
  
    @ApiPropertyOptional({
      description: 'Indica si la aplicación está activa',
      example: true,
      default: true,
    })
    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    isActive?: boolean;
  }
  
  /**
   * DTO para actualizar una aplicación
   */
  export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
    @ApiPropertyOptional({
      description: 'Estado de la aplicación',
      example: 'in_review',
      enum: ['pending', 'in_review', 'accepted', 'rejected'],
    })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['pending', 'in_review', 'accepted', 'rejected'], { 
      message: 'El estado debe ser pending, in_review, accepted o rejected' 
    })
    @IsOptional()
    status?: string;
  }
  
  /**
   * DTO para filtrar aplicaciones
   */
  export class FilterApplicationDto {
    @ApiPropertyOptional({
      description: 'Filtrar por estado activo/inactivo',
      example: true,
    })
    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    isActive?: boolean;
  
    @ApiPropertyOptional({
      description: 'Filtrar por estado de la aplicación',
      example: 'pending',
      enum: ['pending', 'in_review', 'accepted', 'rejected'],
    })
    @IsString({ message: 'El estado debe ser un texto' })
    @IsIn(['pending', 'in_review', 'accepted', 'rejected'], { 
      message: 'El estado debe ser pending, in_review, accepted o rejected' 
    })
    @IsOptional()
    status?: string;
  
    @ApiPropertyOptional({
      description: 'Filtrar por vacante',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID('4', { message: 'El ID de vacante debe ser un UUID válido' })
    @IsOptional()
    vacancyId?: string;
  
    @ApiPropertyOptional({
      description: 'Búsqueda por nombre o email',
      example: 'juan',
    })
    @IsString({ message: 'El término de búsqueda debe ser un texto' })
    @IsOptional()
    search?: string;
  }
  
  /**
   * DTO para la respuesta de aplicación
   */
  export class ApplicationResponseDto {
    @ApiProperty({
      description: 'ID único de la aplicación',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;
  
    @ApiProperty({
      description: 'ID de la vacante a la que se aplica',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    vacancyId: string;
  
    @ApiProperty({
      description: 'Nombre completo del aplicante',
      example: 'Juan Pérez',
    })
    name: string;
  
    @ApiProperty({
      description: 'Email del aplicante',
      example: 'juan.perez@ejemplo.com',
    })
    email: string;
  
    @ApiProperty({
      description: 'Número de teléfono del aplicante',
      example: '+34 600 123 456',
    })
    phone: string;
  
    @ApiProperty({
      description: 'Estado de la aplicación',
      example: 'pending',
    })
    status: string;
  
    @ApiPropertyOptional({
      description: 'Motivación o carta de presentación',
      example: 'Me interesa esta posición porque...',
    })
    applicationMotivation?: string;
  
    @ApiProperty({
      description: 'Indica si la aplicación está activa',
      example: true,
    })
    isActive: boolean;
  
    @ApiPropertyOptional({
      description: 'URL al currículum vitae',
      example: 'https://ejemplo.com/cv.pdf',
    })
    cvUrl?: string;
  
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
  
    constructor(partial: Partial<ApplicationResponseDto>) {
      Object.assign(this, partial);
    }
  }