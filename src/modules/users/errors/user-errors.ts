import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos del dominio de Usuarios
 * 
 * Define los errores que pueden ocurrir en el dominio de usuarios, 
 * con códigos de error específicos y mensajes descriptivos.
 * También incluye el código HTTP correspondiente para la API.
 */
export const UserErrors = {
  // Errores de validación
  INVALID_EMAIL: {
    errorCode: 'USER_INVALID_EMAIL',
    message: 'El formato del email no es válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_PASSWORD: {
    errorCode: 'USER_INVALID_PASSWORD',
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_NAME: {
    errorCode: 'USER_INVALID_NAME',
    message: 'El nombre no puede estar vacío',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  
  // Errores de negocio
  USER_ALREADY_EXISTS: {
    errorCode: 'USER_ALREADY_EXISTS',
    message: 'Ya existe un usuario con ese email',
    httpStatus: HttpStatus.CONFLICT,
  },
  USER_NOT_FOUND: {
    errorCode: 'USER_NOT_FOUND',
    message: 'Usuario no encontrado',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  USER_SLUG_NOT_FOUND: {
    errorCode: 'USER_SLUG_NOT_FOUND',
    message: 'Usuario con ese slug no encontrado',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  USER_INACTIVE: {
    errorCode: 'USER_INACTIVE',
    message: 'El usuario está inactivo',
    httpStatus: HttpStatus.FORBIDDEN,
  },
  
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'USER_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  EXTERNAL_SERVICE_ERROR: {
    errorCode: 'USER_EXTERNAL_SERVICE_ERROR',
    message: 'Error en el servicio externo',
    httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
  },
};