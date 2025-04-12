import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos del dominio de Blogs
 * 
 * Define los errores que pueden ocurrir en el dominio de blogs, 
 * con códigos de error específicos y mensajes descriptivos.
 * También incluye el código HTTP correspondiente para la API.
 */
export const BlogErrors = {
  // Errores de validación
  INVALID_USER_ID: {
    errorCode: 'BLOG_INVALID_USER_ID',
    message: 'El ID de usuario no es válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_TITLE: {
    errorCode: 'BLOG_INVALID_TITLE',
    message: 'El título no puede estar vacío',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_SECTION_TYPE: {
    errorCode: 'BLOG_INVALID_SECTION_TYPE',
    message: 'El tipo de sección debe ser uno de los valores permitidos',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_LIST_STYLE: {
    errorCode: 'BLOG_INVALID_LIST_STYLE',
    message: 'El estilo de lista debe ser ordered o unordered',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  MISSING_REQUIRED_FIELDS: {
    errorCode: 'BLOG_MISSING_REQUIRED_FIELDS',
    message: 'Faltan campos requeridos para el tipo de sección especificado',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  
  // Errores de negocio
  BLOG_NOT_FOUND: {
    errorCode: 'BLOG_NOT_FOUND',
    message: 'Blog no encontrado',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  BLOG_SECTION_NOT_FOUND: {
    errorCode: 'BLOG_SECTION_NOT_FOUND',
    message: 'Sección de blog no encontrada',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND: {
    errorCode: 'BLOG_USER_NOT_FOUND',
    message: 'El usuario no existe',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  SLUG_ALREADY_EXISTS: {
    errorCode: 'BLOG_SLUG_ALREADY_EXISTS',
    message: 'Ya existe un blog con ese slug',
    httpStatus: HttpStatus.CONFLICT,
  },
  
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'BLOG_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};