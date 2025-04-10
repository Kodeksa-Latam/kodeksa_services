import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos del dominio de Skills
 * 
 * Define los errores que pueden ocurrir en el dominio de habilidades, 
 * con códigos de error específicos y mensajes descriptivos.
 * También incluye el código HTTP correspondiente para la API.
 */
export const SkillErrors = {
  // Errores de validación
  INVALID_USER_ID: {
    errorCode: 'SKILL_INVALID_USER_ID',
    message: 'El ID de usuario no es válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_SKILL_NAME: {
    errorCode: 'SKILL_INVALID_NAME',
    message: 'El nombre de la habilidad no puede estar vacío',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_URL: {
    errorCode: 'SKILL_INVALID_URL',
    message: 'La URL del certificado no tiene un formato válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  
  // Errores de negocio
  SKILL_NOT_FOUND: {
    errorCode: 'SKILL_NOT_FOUND',
    message: 'Habilidad no encontrada',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND: {
    errorCode: 'SKILL_USER_NOT_FOUND',
    message: 'El usuario no existe',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'SKILL_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};