import { HttpStatus } from '@nestjs/common';

/**
 * Errores específicos del dominio de Configuraciones de Tarjeta
 * 
 * Define los errores que pueden ocurrir en el dominio de configuraciones de tarjeta, 
 * con códigos de error específicos y mensajes descriptivos.
 * También incluye el código HTTP correspondiente para la API.
 */
export const CardConfigurationErrors = {
  // Errores de validación
  INVALID_USER_ID: {
    errorCode: 'CARD_CONFIG_INVALID_USER_ID',
    message: 'El ID de usuario no es válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  INVALID_COLOR: {
    errorCode: 'CARD_CONFIG_INVALID_COLOR',
    message: 'El color debe ser un código hexadecimal válido',
    httpStatus: HttpStatus.BAD_REQUEST,
  },
  
  // Errores de negocio
  CONFIG_ALREADY_EXISTS: {
    errorCode: 'CARD_CONFIG_ALREADY_EXISTS',
    message: 'Ya existe una configuración para este usuario',
    httpStatus: HttpStatus.CONFLICT,
  },
  CONFIG_NOT_FOUND: {
    errorCode: 'CARD_CONFIG_NOT_FOUND',
    message: 'Configuración de tarjeta no encontrada',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND: {
    errorCode: 'CARD_CONFIG_USER_NOT_FOUND',
    message: 'El usuario no existe',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  
  // Errores de sistema
  DATABASE_ERROR: {
    errorCode: 'CARD_CONFIG_DATABASE_ERROR',
    message: 'Error en la base de datos',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};