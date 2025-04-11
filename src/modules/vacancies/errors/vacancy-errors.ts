import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos del dominio de Vacantes
 * 
 * Define los errores que pueden ocurrir en el dominio de vacantes, 
 * con códigos de error específicos y mensajes descriptivos.
 * También incluye el código HTTP correspondiente para la API.
 */
export const VacancyErrors = {
  // Errores de validación
  INVALID_JOB_TITLE: {
    errorCode: 'VACANCY_INVALID_JOB_TITLE',
    message: 'El título del puesto no puede estar vacío',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_MODE: {
    errorCode: 'VACANCY_INVALID_MODE',
    message: 'La modalidad debe ser Remoto, Presencial o Híbrido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_YEARS_EXPERIENCE: {
    errorCode: 'VACANCY_INVALID_YEARS_EXPERIENCE',
    message: 'Los años de experiencia deben ser un número entero no negativo',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_STATUS: {
    errorCode: 'VACANCY_INVALID_STATUS',
    message: 'El estado debe ser open, closed o on_hold',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_STACK: {
    errorCode: 'VACANCY_INVALID_STACK',
    message: 'Debe incluir al menos una tecnología requerida',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  
  // Errores de negocio
  VACANCY_NOT_FOUND: {
    errorCode: 'VACANCY_NOT_FOUND',
    message: 'Vacante no encontrada',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  VACANCY_SLUG_NOT_FOUND: {
    errorCode: 'VACANCY_SLUG_NOT_FOUND',
    message: 'Vacante con ese slug no encontrada',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  VACANCY_CLOSED: {
    errorCode: 'VACANCY_CLOSED',
    message: 'Esta vacante está cerrada y no acepta nuevas aplicaciones',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  SLUG_ALREADY_EXISTS: {
    errorCode: 'VACANCY_SLUG_ALREADY_EXISTS',
    message: 'Ya existe una vacante con ese slug',
    httpStatus: HttpStatus.CONFLICT,
  },
  
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'VACANCY_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};