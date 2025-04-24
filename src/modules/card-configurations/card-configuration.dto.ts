import { IsString, IsOptional, IsHexColor, IsUUID, IsInt, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

/**
 * DTO para crear una configuración de tarjeta
 */
export class CreateCardConfigurationDto {
  @ApiProperty({
    description: 'ID del usuario al que pertenece esta configuración',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
  userId: string;

  @ApiPropertyOptional({
    description: 'Tamaño de la imagen',
    example: 90,
  })
  @IsNumber({}, { message: 'El tamaño de la imagen debe ser un número' })
  @IsOptional()
  imageSize?: number;

  @ApiPropertyOptional({
    description: 'Tamaño de la imagen',
    example: 90,
  })

  @ApiPropertyOptional({ description: 'Que tan lejos quedará la imagen de la izquierda' })
  @IsOptional()
  imageLeftOffset?: string;

  @ApiPropertyOptional({
    description: 'Color de fondo en formato hexadecimal',
    example: '#FFFFFF',
  })
  @IsHexColor({ message: 'El color de fondo debe ser un código hexadecimal válido' })
  @IsOptional()
  bgColor?: string;

  @ApiPropertyOptional({
    description: 'Texto superior de la tarjeta',
    example: 'Bienvenido',
  })
  @IsString({ message: 'El texto superior debe ser un texto' })
  @IsOptional()
  textAbove?: string;

  @ApiPropertyOptional({
    description: 'Color del texto superior en formato hexadecimal',
    example: '#000000',
  })
  @IsHexColor({ message: 'El color del texto superior debe ser un código hexadecimal válido' })
  @IsOptional()
  textAboveColor?: string;

  @ApiPropertyOptional({
    description: 'Familia de fuente del texto superior',
    example: 'Arial',
  })
  @IsString({ message: 'La familia de fuente del texto superior debe ser un texto' })
  @IsOptional()
  aboveFontFamily?: string;

  @ApiPropertyOptional({
    description: 'Tamaño de fuente del texto superior',
    example: '16px',
  })
  @IsString({ message: 'El tamaño de fuente del texto superior debe ser un texto' })
  @IsOptional()
  aboveFontSize?: string;

  @ApiPropertyOptional({
    description: 'Peso de fuente del texto superior',
    example: 'bold',
  })
  @IsString({ message: 'El peso de fuente del texto superior debe ser un texto' })
  @IsOptional()
  aboveFontWeight?: string;

  @ApiPropertyOptional({
    description: 'Espaciado entre letras del texto superior',
    example: '0.5px',
  })
  @IsString({ message: 'El espaciado entre letras del texto superior debe ser un texto' })
  @IsOptional()
  aboveLetterSpacing?: string;

  @ApiPropertyOptional({
    description: 'Transformación del texto superior',
    example: 'uppercase',
  })
  @IsString({ message: 'La transformación del texto superior debe ser un texto' })
  @IsOptional()
  aboveTextTransform?: string;

  @ApiPropertyOptional({
    description: 'Desplazamiento superior del texto superior',
    example: '10px',
  })
  @IsString({ message: 'El desplazamiento superior del texto superior debe ser un texto' })
  @IsOptional()
  aboveTextTopOffset?: string;

  @ApiPropertyOptional({
    description: 'Texto inferior de la tarjeta',
    example: 'Gracias por su visita',
  })
  @IsString({ message: 'El texto inferior debe ser un texto' })
  @IsOptional()
  textBelow?: string;

  @ApiPropertyOptional({
    description: 'Peso de fuente del texto inferior',
    example: 'normal',
  })
  @IsString({ message: 'El peso de fuente del texto inferior debe ser un texto' })
  @IsOptional()
  belowFontWeight?: string;

  @ApiPropertyOptional({
    description: 'Espaciado entre letras del texto inferior',
    example: '0.5px',
  })
  @IsString({ message: 'El espaciado entre letras del texto inferior debe ser un texto' })
  @IsOptional()
  belowLetterSpacing?: string;

  @ApiPropertyOptional({
    description: 'Familia de fuente del texto inferior',
    example: 'Arial',
  })
  @IsString({ message: 'La familia de fuente del texto inferior debe ser un texto' })
  @IsOptional()
  belowFontFamily?: string;
  
  @ApiPropertyOptional({
    description: 'Tamaño de fuente del texto inferior',
    example: '16px',
  })
  @IsString({ message: 'El tamaño de fuente del texto inferior debe ser un texto' })
  @IsOptional()
  belowFontSize?: string;

  @ApiPropertyOptional({
    description: 'Transformación del texto inferior',
    example: 'lowercase',
  })
  @IsString({ message: 'La transformación del texto inferior debe ser un texto' })
  @IsOptional()
  belowTextTransform?: string;

  @ApiPropertyOptional({
    description: 'Color del texto inferior en formato hexadecimal',
    example: '#000000',
  })
  @IsHexColor({ message: 'El color del texto inferior debe ser un código hexadecimal válido' })
  @IsOptional()
  textBelowColor?: string;
}

/**
 * DTO para actualizar una configuración de tarjeta
 */
export class UpdateCardConfigurationDto extends PartialType(CreateCardConfigurationDto) {
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
  @IsOptional()
  userId?: string;
}

/**
 * DTO para la respuesta de configuración de tarjeta
 */
export class CardConfigurationResponseDto {
  @ApiProperty({
    description: 'ID único de la configuración de tarjeta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario al que pertenece esta configuración',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Tamaño de la imagen',
    example: 90,
  })
  imageSize: number;

  @ApiPropertyOptional({
    description: 'separación de la imagen de la izquierda',
    example: "0",
  })
  imageLeftOffset: string;

  @ApiPropertyOptional({
    description: 'Color de fondo en formato hexadecimal',
    example: '#FFFFFF',
  })
  bgColor: string;

  @ApiPropertyOptional({
    description: 'Texto superior de la tarjeta',
    example: 'Bienvenido',
  })
  textAbove: string;

  @ApiPropertyOptional({
    description: 'Color del texto superior en formato hexadecimal',
    example: '#000000',
  })
  textAboveColor: string;

  @ApiPropertyOptional({
    description: 'Familia de fuente del texto superior',
    example: 'Arial',
  })
  aboveFontFamily: string;

  @ApiPropertyOptional({
    description: 'Tamaño de fuente del texto superior',
    example: '16px',
  })
  aboveFontSize: string;

  @ApiPropertyOptional({
    description: 'Peso de fuente del texto superior',
    example: 'bold',
  })
  aboveFontWeight: string;

  @ApiPropertyOptional({
    description: 'Espaciado entre letras del texto superior',
    example: '0.5px',
  })
  aboveLetterSpacing: string;

  @ApiPropertyOptional({
    description: 'Transformación del texto superior',
    example: 'uppercase',
  })
  aboveTextTransform: string;

  @ApiPropertyOptional({
    description: 'Desplazamiento superior del texto superior',
    example: '10px',
  })
  aboveTextTopOffset: string;

  @ApiPropertyOptional({
    description: 'Texto inferior de la tarjeta',
    example: 'Gracias por su visita',
  })
  textBelow: string;

  @ApiPropertyOptional({
    description: 'Peso de fuente del texto inferior',
    example: 'normal',
  })
  belowFontWeight: string;

  @ApiPropertyOptional({
    description: 'Espaciado entre letras del texto inferior',
    example: '0.5px',
  })
  belowLetterSpacing: string;

  @ApiPropertyOptional({
    description: 'Familia de fuente del texto inferior',
    example: 'Arial',
  })
  belowFontFamily: string;

  @ApiPropertyOptional({
    description: 'Tamaño de fuente del texto inferior',
    example: '16px',
  })
  belowFontSize: string;

  @ApiPropertyOptional({
    description: 'Transformación del texto inferior',
    example: 'lowercase',
  })
  belowTextTransform: string;

  @ApiPropertyOptional({
    description: 'Color del texto inferior en formato hexadecimal',
    example: '#000000',
  })
  textBelowColor: string;

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

  constructor(partial: Partial<CardConfigurationResponseDto>) {
    Object.assign(this, partial);
  }
}