import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos del dominio de Experiencias Laborales
 * 
 * Define los errores que pueden ocurrir en el dominio de experiencias laborales, 
 * con códigos de error específicos y mensajes descriptivos.
 * También incluye el código HTTP correspondiente para la API.
 */
export const WorkExperienceErrors = {
  // Errores de validación
  INVALID_USER_ID: {
    errorCode: 'WORK_EXPERIENCE_INVALID_USER_ID',
    message: 'El ID de usuario no es válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_ROLE: {
    errorCode: 'WORK_EXPERIENCE_INVALID_ROLE',
    message: 'El rol no puede estar vacío',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_COMPANY_NAME: {
    errorCode: 'WORK_EXPERIENCE_INVALID_COMPANY_NAME',
    message: 'El nombre de la empresa no puede estar vacío',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_FROM_YEAR: {
    errorCode: 'WORK_EXPERIENCE_INVALID_FROM_YEAR',
    message: 'La fecha de inicio debe tener un formato válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_UNTIL_YEAR: {
    errorCode: 'WORK_EXPERIENCE_INVALID_UNTIL_YEAR',
    message: 'La fecha de fin debe tener un formato válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  UNTIL_BEFORE_FROM: {
    errorCode: 'WORK_EXPERIENCE_UNTIL_BEFORE_FROM',
    message: 'La fecha de fin no puede ser anterior a la fecha de inicio',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  
  // Errores de negocio
  WORK_EXPERIENCE_NOT_FOUND: {
    errorCode: 'WORK_EXPERIENCE_NOT_FOUND',
    message: 'Experiencia laboral no encontrada',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND: {
    errorCode: 'WORK_EXPERIENCE_USER_NOT_FOUND',
    message: 'El usuario no existe',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'WORK_EXPERIENCE_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};