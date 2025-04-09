/**
 * Interfaz de Usuario
 * 
 * Define la estructura de datos de un usuario en la aplicación.
 * Se utiliza para tipar los datos de usuario en toda la aplicación.
 */
export interface IUser {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  /**
   * Interfaz para crear un usuario
   */
  export interface ICreateUser {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }
  
  /**
   * Interfaz para actualizar un usuario
   */
  export interface IUpdateUser {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    isActive?: boolean;
  }