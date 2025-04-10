import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos del dominio de Currículum
 * 
 * Define los errores que pueden ocurrir en el dominio de currículums, 
 * con códigos de error específicos y mensajes descriptivos.
 * También incluye el código HTTP correspondiente para la API.
 */
export const CurriculumErrors = {
  // Errores de validación
  INVALID_USER_ID: {
    errorCode: 'CURRICULUM_INVALID_USER_ID',
    message: 'El ID de usuario no es válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  
  // Errores de negocio
  CURRICULUM_ALREADY_EXISTS: {
    errorCode: 'CURRICULUM_ALREADY_EXISTS',
    message: 'Ya existe un currículum para este usuario',
    httpStatus: HttpStatus.CONFLICT,
  },
  CURRICULUM_NOT_FOUND: {
    errorCode: 'CURRICULUM_NOT_FOUND',
    message: 'Currículum no encontrado',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND: {
    errorCode: 'CURRICULUM_USER_NOT_FOUND',
    message: 'El usuario no existe',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'CURRICULUM_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};