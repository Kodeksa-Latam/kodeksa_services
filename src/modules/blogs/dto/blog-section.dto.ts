import { 
    IsString, 
    IsOptional, 
    IsEnum, 
    IsInt, 
    Min, 
    IsUrl,
    IsArray,
    ValidateIf,
    ArrayMinSize
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
  import { BlogSectionType, BlogSectionListStyle } from '../blog-section.entity';
  
  
  /**
   * DTO para crear una sección de blog
   */
  export class CreateBlogSectionDto {
    @ApiPropertyOptional({
      description: 'ID del blog al que pertenece esta sección',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString({ message: 'El ID del blog debe ser un texto' })
    @IsOptional()
    blogId?: string;
  
    @ApiProperty({
      description: 'Orden de la sección en el blog',
      example: 1,
    })
    @IsInt({ message: 'El orden debe ser un número entero' })
    @Min(0, { message: 'El orden no puede ser negativo' })
    order: number;
  
    @ApiProperty({
      description: 'Tipo de sección',
      enum: BlogSectionType,
      example: BlogSectionType.PARAGRAPH,
    })
    @IsEnum(BlogSectionType, { message: 'El tipo debe ser uno de los valores permitidos' })
    type: BlogSectionType;
  
    @ApiPropertyOptional({
      description: 'Contenido de texto de la sección (para paragraph, heading, subheading)',
      example: 'Este es un párrafo de ejemplo.',
    })
    @IsString({ message: 'El contenido debe ser un texto' })
    @ValidateIf(o => [BlogSectionType.PARAGRAPH, BlogSectionType.HEADING, BlogSectionType.SUBHEADING].includes(o.type))
    content?: string;
  
    @ApiPropertyOptional({
      description: 'URL de la imagen (solo para type: image)',
      example: 'https://example.com/images/blog-image.jpg',
    })
    @IsUrl({}, { message: 'La URL de la imagen debe tener un formato válido' })
    @ValidateIf(o => o.type === BlogSectionType.IMAGE)
    src?: string;
  
    @ApiPropertyOptional({
      description: 'Texto alternativo de la imagen (solo para type: image)',
      example: 'Descripción de la imagen',
    })
    @IsString({ message: 'El texto alternativo debe ser un texto' })
    @ValidateIf(o => o.type === BlogSectionType.IMAGE)
    alt?: string;
  
    @ApiPropertyOptional({
      description: 'Leyenda de la imagen (solo para type: image)',
      example: 'Figura 1: Diagrama de arquitectura',
    })
    @IsString({ message: 'La leyenda debe ser un texto' })
    @ValidateIf(o => o.type === BlogSectionType.IMAGE)
    @IsOptional()
    caption?: string;
  
    @ApiPropertyOptional({
      description: 'Estilo de la lista (solo para type: list)',
      enum: BlogSectionListStyle,
      example: BlogSectionListStyle.UNORDERED,
    })
    @IsEnum(BlogSectionListStyle, { message: 'El estilo debe ser ordered o unordered' })
    @ValidateIf(o => o.type === BlogSectionType.LIST)
    style?: BlogSectionListStyle;
  
    @ApiPropertyOptional({
      description: 'Elementos de la lista (solo para type: list)',
      example: ['Primer elemento', 'Segundo elemento', 'Tercer elemento'],
      type: [String],
    })
    @IsArray({ message: 'Los elementos deben ser un array de textos' })
    @IsString({ each: true, message: 'Cada elemento debe ser un texto' })
    @ArrayMinSize(1, { message: 'La lista debe tener al menos un elemento' })
    @ValidateIf(o => o.type === BlogSectionType.LIST)
    items?: string[];
  }
  
  /**
   * DTO para actualizar una sección de blog
   */
  export class UpdateBlogSectionDto extends PartialType(CreateBlogSectionDto) {}
  
  /**
   * DTO para la respuesta de sección de blog
   */
  export class BlogSectionResponseDto {
    @ApiProperty({
      description: 'ID único de la sección',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;
  
    @ApiProperty({
      description: 'ID del blog al que pertenece esta sección',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    blogId: string;
  
    @ApiProperty({
      description: 'Orden de la sección en el blog',
      example: 1,
    })
    order: number;
  
    @ApiProperty({
      description: 'Tipo de sección',
      enum: BlogSectionType,
      example: BlogSectionType.PARAGRAPH,
    })
    type: BlogSectionType;
  
    @ApiPropertyOptional({
      description: 'Contenido de texto de la sección',
      example: 'Este es un párrafo de ejemplo.',
    })
    content?: string;
  
    @ApiPropertyOptional({
      description: 'URL de la imagen',
      example: 'https://example.com/images/blog-image.jpg',
    })
    src?: string;
  
    @ApiPropertyOptional({
      description: 'Texto alternativo de la imagen',
      example: 'Descripción de la imagen',
    })
    alt?: string;
  
    @ApiPropertyOptional({
      description: 'Leyenda de la imagen',
      example: 'Figura 1: Diagrama de arquitectura',
    })
    caption?: string;
  
    @ApiPropertyOptional({
      description: 'Estilo de la lista',
      enum: BlogSectionListStyle,
      example: BlogSectionListStyle.UNORDERED,
    })
    style?: BlogSectionListStyle;
  
    @ApiPropertyOptional({
      description: 'Elementos de la lista',
      example: ['Primer elemento', 'Segundo elemento', 'Tercer elemento'],
      type: [String],
    })
    items?: string[];
  
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
  
    constructor(partial: Partial<BlogSectionResponseDto>) {
      Object.assign(this, partial);
    }
  }