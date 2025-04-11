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
  APPLICATION_NOT_CREATED: {
    errorCode: 'APPLICATION_NOT_CREATED',
    message: 'Aplicación no creada',
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
  VACANCY_INACTIVE: {
    errorCode: 'APPLICATION_VACANCY_INACTIVE',
    message: 'La vacante no está activa',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  APPLICATION_ALREADY_EXISTS: {
    errorCode: 'APPLICATION_ALREADY_EXISTS',
    message: 'Ya existe una aplicación con este email para esta vacante',
    httpStatus: HttpStatus.CONFLICT,
  },
  
  CV_UPLOAD_ERROR: {
    errorCode: 'APPLICATION_CV_UPLOAD_ERROR',
    message: 'Error al subir el CV. Por favor, inténtalo de nuevo',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  CV_TOO_LARGE: {
    errorCode: 'APPLICATION_CV_TOO_LARGE',
    message: 'El tamaño del CV excede el límite permitido (5MB)',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'APPLICATION_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};