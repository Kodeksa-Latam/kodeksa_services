import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersController } from '../../users.controller';
import { UsersService } from '../../users.service';
import { User } from '../../domain/models/user.model';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserResponseDto } from '../../dto/user-response.dto';
import { PaginatedResult } from '../../../../common/dto/pagination.dto';

// Mock del servicio de usuarios
const mockUsersService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    
    // Resetear todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debe devolver una lista paginada de usuarios', async () => {
      // Arrange
      const mockUser = new User({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashed_password',
      });
      
      const mockPaginatedResult: PaginatedResult<User> = {
        items: [mockUser],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      
      mockUsersService.findAll.mockResolvedValue(mockPaginatedResult);
      
      // Act
      const result = await controller.findAll({ page: 1, limit: 10 });
      
      // Assert
      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        isActive: undefined,
        search: undefined,
      });
      expect(result.items[0]).toBeInstanceOf(UserResponseDto);
      expect(result.items.length).toBe(1);
      expect(result.meta).toEqual(mockPaginatedResult.meta);
    });
  });

  describe('findById', () => {
    it('debe devolver un usuario por su ID', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUser = new User({
        id: userId,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashed_password',
      });
      
      mockUsersService.findById.mockResolvedValue(mockUser);
      
      // Act
      const result = await controller.findById(userId);
      
      // Assert
      expect(service.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toBe(userId);
      expect(result.password).toBeUndefined(); // Verificar que la contraseña esté excluida
    });

    it('debe propagar el error si el usuario no existe', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const notFoundError = new HttpException(
        { message: 'Usuario no encontrado', errorCode: 'USER_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
      
      mockUsersService.findById.mockRejectedValue(notFoundError);
      
      // Act & Assert
      await expect(controller.findById(userId)).rejects.toThrow(HttpException);
      expect(service.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    it('debe crear un usuario correctamente', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'Password123',
      };
      
      const mockCreatedUser = new User({
        id: '2',
        ...createUserDto,
        password: 'hashed_password',
      });
      
      mockUsersService.create.mockResolvedValue(mockCreatedUser);
      
      // Act
      const result = await controller.create(createUserDto);
      
      // Assert
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.email).toBe(createUserDto.email);
      expect(result.password).toBeUndefined(); // Verificar que la contraseña esté excluida
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario correctamente', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };
      
      const mockUpdatedUser = new User({
        id: userId,
        email: 'existing@example.com',
        firstName: updateUserDto.firstName!,
        lastName: updateUserDto.lastName!,
        password: 'hashed_password',
      });
      
      mockUsersService.update.mockResolvedValue(mockUpdatedUser);
      
      // Act
      const result = await controller.update(userId, updateUserDto);
      
      // Assert
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.firstName).toBe(updateUserDto.firstName);
      expect(result.lastName).toBe(updateUserDto.lastName);
    });
  });

  describe('delete', () => {
    it('debe eliminar un usuario correctamente', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      mockUsersService.delete.mockResolvedValue(true);
      
      // Act
      await controller.delete(userId);
      
      // Assert
      expect(service.delete).toHaveBeenCalledWith(userId);
    });
  });
});