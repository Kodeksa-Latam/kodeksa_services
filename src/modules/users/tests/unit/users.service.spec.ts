import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { UsersService } from '../../users.service';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository';
import { ExternalServiceClient } from '../../infrastructure/http/external-service.client';
import { User } from '../../domain/models/user.model';
import { ICreateUser, IUpdateUser } from '../../domain/interfaces/user.interface';

// Mock del repositorio
const mockUserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock del cliente de servicio externo
const mockExternalServiceClient = {
  notifyUserCreation: jest.fn(),
  verifyUserInfo: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;
  let externalService: ExternalServiceClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: ExternalServiceClient,
          useValue: mockExternalServiceClient,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
    externalService = module.get<ExternalServiceClient>(ExternalServiceClient);
    
    // Resetear todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe devolver una lista paginada de usuarios', async () => {
      // Arrange
      const mockPaginatedResult = {
        items: [
          new User({
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            password: 'hashed_password',
          }),
        ],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      
      mockUserRepository.findAll.mockResolvedValue(mockPaginatedResult);
      
      // Act
      const result = await service.findAll({ page: 1, limit: 10 });
      
      // Assert
      expect(repository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        filters: {
          isActive: undefined,
          search: undefined,
        },
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('debe manejar errores en la búsqueda', async () => {
      // Arrange
      mockUserRepository.findAll.mockRejectedValue(new Error('Database error'));
      
      // Act & Assert
      await expect(service.findAll({ page: 1, limit: 10 })).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    it('debe encontrar un usuario por su ID', async () => {
      // Arrange
      const mockUser = new User({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashed_password',
      });
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      
      // Act
      const result = await service.findById('1');
      
      // Assert
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('debe lanzar una excepción si el usuario no existe', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.findById('1')).rejects.toThrow(HttpException);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('debe crear un usuario correctamente', async () => {
      // Arrange
      const createUserData: ICreateUser = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'Password123',
      };
      
      const mockCreatedUser = new User({
        id: '2',
        ...createUserData,
        password: 'hashed_password',
      });
      
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);
      mockExternalServiceClient.notifyUserCreation.mockResolvedValue(undefined);
      
      // Act
      const result = await service.create(createUserData);
      
      // Assert
      expect(repository.findByEmail).toHaveBeenCalledWith(createUserData.email);
      expect(repository.create).toHaveBeenCalled();
      expect(externalService.notifyUserCreation).toHaveBeenCalledWith(mockCreatedUser.id);
      expect(result).toEqual(mockCreatedUser);
    });

    it('debe lanzar una excepción si el email ya existe', async () => {
      // Arrange
      const createUserData: ICreateUser = {
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        password: 'Password123',
      };
      
      const mockExistingUser = new User({
        id: '3',
        ...createUserData,
        password: 'hashed_password',
      });
      
      mockUserRepository.findByEmail.mockResolvedValue(mockExistingUser);
      
      // Act & Assert
      await expect(service.create(createUserData)).rejects.toThrow(HttpException);
      expect(repository.findByEmail).toHaveBeenCalledWith(createUserData.email);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('debe lanzar una excepción si el email es inválido', async () => {
      // Arrange
      const createUserData: ICreateUser = {
        email: 'invalid-email',
        firstName: 'Invalid',
        lastName: 'Email',
        password: 'Password123',
      };
      
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.create(createUserData)).rejects.toThrow(HttpException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('debe lanzar una excepción si la contraseña es inválida', async () => {
      // Arrange
      const createUserData: ICreateUser = {
        email: 'valid@example.com',
        firstName: 'Valid',
        lastName: 'Email',
        password: 'weak', // Contraseña débil
      };
      
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.create(createUserData)).rejects.toThrow(HttpException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario correctamente', async () => {
      // Arrange
      const userId = '4';
      const updateUserData: IUpdateUser = {
        firstName: 'Updated',
        lastName: 'Name',
      };
      
      const mockExistingUser = new User({
        id: userId,
        email: 'existing@example.com',
        firstName: 'Original',
        lastName: 'Name',
        password: 'hashed_password',
      });
      
      const mockUpdatedUser = new User({
        ...mockExistingUser,
        firstName: updateUserData.firstName!,
        lastName: updateUserData.lastName!,
      });
      
      mockUserRepository.findById.mockResolvedValue(mockExistingUser);
      mockUserRepository.update.mockResolvedValue(mockUpdatedUser);
      
      // Act
      const result = await service.update(userId, updateUserData);
      
      // Assert
      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(repository.update).toHaveBeenCalledWith(userId, updateUserData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('debe lanzar una excepción si el usuario no existe', async () => {
      // Arrange
      const userId = '999';
      const updateUserData: IUpdateUser = {
        firstName: 'Will Not',
        lastName: 'Update',
      };
      
      mockUserRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.update(userId, updateUserData)).rejects.toThrow(HttpException);
      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('debe eliminar un usuario correctamente', async () => {
      // Arrange
      const userId = '5';
      
      const mockExistingUser = new User({
        id: userId,
        email: 'delete@example.com',
        firstName: 'To Be',
        lastName: 'Deleted',
        password: 'hashed_password',
      });
      
      mockUserRepository.findById.mockResolvedValue(mockExistingUser);
      mockUserRepository.delete.mockResolvedValue(true);
      
      // Act
      const result = await service.delete(userId);
      
      // Assert
      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(repository.delete).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it('debe lanzar una excepción si el usuario no existe', async () => {
      // Arrange
      const userId = '999';
      
      mockUserRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.delete(userId)).rejects.toThrow(HttpException);
      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});