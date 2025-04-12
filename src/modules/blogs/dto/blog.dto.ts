import { 
    IsString, 
    IsOptional, 
    IsBoolean, 
    IsUUID, 
    IsArray, 
    ValidateNested,
    ArrayMinSize
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
  import { Type } from 'class-transformer';
  import { CreateBlogSectionDto, BlogSectionResponseDto } from './blog-section.dto';
  
  /**
   * DTO para crear un blog
   */
  export class CreateBlogDto {
    @ApiProperty({
      description: 'ID del usuario al que pertenece este blog',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
    userId: string;
  
    @ApiProperty({
      description: 'Título del blog',
      example: 'Cómo implementar NestJS con TypeORM',
    })
    @IsString({ message: 'El título debe ser un texto' })
    title: string;
  
    @ApiPropertyOptional({
      description: 'Slug del blog (si no se proporciona, se generará a partir del título)',
      example: 'como-implementar-nestjs-con-typeorm',
    })
    @IsString({ message: 'El slug debe ser un texto' })
    @IsOptional()
    slug?: string;
  
    @ApiPropertyOptional({
      description: 'URL de la imagen destacada',
      example: 'https://example.com/images/blog-cover.jpg',
    })
    @IsString({ message: 'La imagen debe ser un texto' })
    @IsOptional()
    image?: string;
  
    @ApiProperty({
      description: 'Descripción corta del blog',
      example: 'Un tutorial paso a paso para implementar NestJS con TypeORM.',
    })
    @IsString({ message: 'La descripción corta debe ser un texto' })
    shortDescription: string;
  
    @ApiPropertyOptional({
      description: 'Categorías del blog',
      example: ['NestJS', 'TypeORM', 'TypeScript'],
      type: [String],
    })
    @IsArray({ message: 'Las categorías deben ser un array de textos' })
    @IsString({ each: true, message: 'Cada categoría debe ser un texto' })
    @IsOptional()
    categories?: string[];
  
    @ApiPropertyOptional({
      description: 'Indica si el blog está activo',
      example: true,
      default: true,
    })
    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    isActive?: boolean;
  
    @ApiPropertyOptional({
      description: 'Secciones del blog',
      type: [CreateBlogSectionDto],
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateBlogSectionDto)
    @ArrayMinSize(0)
    sections?: CreateBlogSectionDto[];
  }
  
  /**
   * DTO para actualizar un blog
   */
  export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
  
  /**
   * Información del autor del blog
   */
  export class AuthorDto {
    @ApiProperty({
      description: 'Nombre del autor',
      example: 'Keny Ramírez',
    })
    name: string;
  
    @ApiProperty({
      description: 'URL del avatar del autor',
      example: '/images/team/keny-ramirez.png',
    })
    avatar: string;

    @ApiProperty({
      description: 'Rol del autor',
      example: 'Frontend developer',
    })
    role: string;
  }
  
  /**
   * DTO para la respuesta de blog
   */
  export class BlogResponseDto {
    @ApiProperty({
      description: 'ID único del blog',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;
  
    @ApiProperty({
      description: 'ID del usuario al que pertenece este blog',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    userId: string;
  
    @ApiProperty({
      description: 'Título del blog',
      example: 'Cómo implementar NestJS con TypeORM',
    })
    title: string;
  
    @ApiProperty({
      description: 'Slug del blog',
      example: 'como-implementar-nestjs-con-typeorm',
    })
    slug: string;
  
    @ApiPropertyOptional({
      description: 'URL de la imagen destacada',
      example: 'https://example.com/images/blog-cover.jpg',
    })
    image?: string;
  
    @ApiProperty({
      description: 'Descripción corta del blog',
      example: 'Un tutorial paso a paso para implementar NestJS con TypeORM.',
    })
    shortDescription: string;
  
    @ApiProperty({
      description: 'Categorías del blog',
      example: ['NestJS', 'TypeORM', 'TypeScript'],
      type: [String],
    })
    categories: string[];
  
    @ApiProperty({
      description: 'Indica si el blog está activo',
      example: true,
    })
    isActive: boolean;
  
    @ApiProperty({
      description: 'Información del autor del blog',
      type: AuthorDto,
    })
    author: AuthorDto;
  
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
      description: 'Secciones del blog',
      type: [BlogSectionResponseDto],
    })
    @Type(() => BlogSectionResponseDto)
    sections?: BlogSectionResponseDto[];
  
    constructor(partial: Partial<BlogResponseDto>) {
      Object.assign(this, partial);
    }
  }