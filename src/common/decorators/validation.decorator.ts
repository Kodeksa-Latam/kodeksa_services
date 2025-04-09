import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Decorator personalizado para validar un email
 */
export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return typeof value === 'string' && emailRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'El email debe tener un formato válido';
        },
      },
    });
  };
}

/**
 * Decorator personalizado para validar una contraseña
 * Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
          return typeof value === 'string' && passwordRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
        },
      },
    });
  };
}

/**
 * Decorator personalizado para validar un código hexadecimal de color
 */
export function IsHexColorWithHash(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isHexColorWithHash',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
          return typeof value === 'string' && hexColorRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'El color debe ser un código hexadecimal válido con # (ejemplo: #FF0000)';
        },
      },
    });
  };
}