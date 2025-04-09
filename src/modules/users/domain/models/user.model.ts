/**
 * Modelo de dominio de Usuario
 * 
 * Esta clase representa el modelo de dominio de un usuario en la aplicación.
 * Contiene la lógica de negocio relacionada con usuarios y sus comportamientos.
 */
export class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(params: {
      id?: string;
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      isActive?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    }) {
      this.id = params.id ?? '';
      this.email = params.email;
      this.firstName = params.firstName;
      this.lastName = params.lastName;
      this.password = params.password;
      this.isActive = params.isActive ?? true;
      this.createdAt = params.createdAt || new Date();
      this.updatedAt = params.updatedAt || new Date();
    }
  
    // Métodos de dominio
    
    get fullName(): string {
      return `${this.firstName} ${this.lastName}`;
    }
  
    activate(): void {
      this.isActive = true;
      this.updatedAt = new Date();
    }
  
    deactivate(): void {
      this.isActive = false;
      this.updatedAt = new Date();
    }
  
    updateEmail(newEmail: string): void {
      if (!this.isValidEmail(newEmail)) {
        throw new Error('Email inválido');
      }
      this.email = newEmail;
      this.updatedAt = new Date();
    }
  
    updateName(firstName: string, lastName: string): void {
      this.firstName = firstName;
      this.lastName = lastName;
      this.updatedAt = new Date();
    }
  
    // Métodos privados
    
    private isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }