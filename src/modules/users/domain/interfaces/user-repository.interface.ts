import { User } from '../models/user.model';
import { ICreateUser, IUpdateUser } from './user.interface';
import { PaginatedResult } from '../../../../common/dto/pagination.dto';

/**
 * Interfaz del Repositorio de Usuarios
 * 
 * Define los métodos que debe implementar cualquier repositorio de usuarios,
 * independientemente de la tecnología de persistencia utilizada.
 */
export interface IUserRepository {
  /**
   * Encuentra todos los usuarios con paginación
   */
  findAll(options: {
    page: number;
    limit: number;
    filters?: {
      isActive?: boolean;
      search?: string;
    };
  }): Promise<PaginatedResult<User>>;

  /**
   * Encuentra un usuario por su ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Encuentra un usuario por su email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Crea un nuevo usuario
   */
  create(userData: ICreateUser): Promise<User>;

  /**
   * Actualiza un usuario existente
   */
  update(id: string, userData: IUpdateUser): Promise<User>;

  /**
   * Elimina un usuario (puede ser borrado lógico o físico)
   */
  delete(id: string): Promise<boolean>;
}