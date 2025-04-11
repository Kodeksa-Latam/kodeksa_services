import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos del dominio de Aplicaciones
 * 
 * Define los errores que pueden ocurrir en el dominio de aplicaciones a vacantes, 
 * con códigos de error específicos y mensajes descriptivos.
 * También incluye el código HTTP correspondiente para la API.
 */
export const ApplicationErrors = {
  // Errores de validación
  INVALID_VACANCY_ID: {
    errorCode: 'APPLICATION_INVALID_VACANCY_ID',
    message: 'El ID de vacante no es válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_NAME: {
    errorCode: 'APPLICATION_INVALID_NAME',
    message: 'El nombre no puede estar vacío',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_EMAIL: {
    errorCode: 'APPLICATION_INVALID_EMAIL',
    message: 'El email debe tener un formato válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_PHONE: {
    errorCode: 'APPLICATION_INVALID_PHONE',
    message: 'El teléfono no puede estar vacío',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_CV_URL: {
    errorCode: 'APPLICATION_INVALID_CV_URL',
    message: 'La URL del CV debe tener un formato válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_STATUS: {
    errorCode: 'APPLICATION_INVALID_STATUS',
    message: 'El estado debe ser pending, in_review, accepted o rejected',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  
  // Errores de negocio
  APPLICATION_NOT_FOUND: {
    errorCode: 'APPLICATION_NOT_FOUND',
    message: 'Aplicación no encontrada',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  VACANCY_NOT_FOUND: {
    errorCode: 'APPLICATION_VACANCY_NOT_FOUND',
    message: 'La vacante no existe',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  VACANCY_CLOSED: {
    errorCode: 'APPLICATION_VACANCY_CLOSED',
    message: 'La vacante está cerrada y no acepta nuevas aplicaciones',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  ALREADY_APPLIED: {
    errorCode: 'APPLICATION_ALREADY_APPLIED',
    message: 'Ya has aplicado a esta vacante con este email',
    httpStatus: HttpStatus.CONFLICT,
  },
  
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'APPLICATION_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};