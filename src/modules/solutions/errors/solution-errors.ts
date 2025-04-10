import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos para el módulo de soluciones
 */
export const SolutionErrors = {
  SOLUTION_NOT_FOUND: {
    message: 'No se encontró la solución',
    code: 'SOLUTION_NOT_FOUND',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  FEATURE_NOT_FOUND: {
    message: 'No se encontró la característica',
    code: 'FEATURE_NOT_FOUND',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  DATABASE_ERROR: {
    message: 'Error en la base de datos',
    code: 'DATABASE_ERROR',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  VALIDATION_ERROR: {
    message: 'Error de validación',
    code: 'VALIDATION_ERROR',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
};