import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateCustomerAccountUseCase } from '../CreateCustomerAccountUseCase';
import { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import { DuplicateEmailException } from '@domain/exceptions/DuplicateEmailException';
import { InvalidCustomerAccountException } from '@domain/exceptions/InvalidCustomerAccountException';

describe('CreateCustomerAccountUseCase', () => {
  let useCase: CreateCustomerAccountUseCase;
  let mockRepository: ICustomerAccountRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findByEmail: vi.fn(),
    };

    useCase = new CreateCustomerAccountUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create a customer account successfully', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
      };

      const createdAccount = new CustomerAccount(
        '123e4567-e89b-12d3-a456-426614174000',
        dto.firstName,
        dto.lastName,
        dto.email,
        dto.phoneNumber,
      );

      vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockRepository.create).mockResolvedValue(createdAccount);

      const result = await useCase.execute(dto);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toEqual(createdAccount);
    });

    it('should throw DuplicateEmailException if email already exists', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
      };

      const existingAccount = new CustomerAccount(
        '123e4567-e89b-12d3-a456-426614174000',
        'Jane',
        'Smith',
        'existing@example.com',
      );

      vi.mocked(mockRepository.findByEmail).mockResolvedValue(existingAccount);

      await expect(useCase.execute(dto)).rejects.toThrow(
        DuplicateEmailException,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InvalidCustomerAccountException if firstName is empty', async () => {
      const dto = {
        firstName: '',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(
        InvalidCustomerAccountException,
      );
    });

    it('should throw InvalidCustomerAccountException if lastName is empty', async () => {
      const dto = {
        firstName: 'John',
        lastName: '',
        email: 'john.doe@example.com',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(
        InvalidCustomerAccountException,
      );
    });

    it('should throw InvalidCustomerAccountException if email is empty', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: '',
      };

      await expect(useCase.execute(dto)).rejects.toThrow(
        InvalidCustomerAccountException,
      );
    });

    it('should throw InvalidCustomerAccountException if email format is invalid', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      };

      vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(
        InvalidCustomerAccountException,
      );
    });
  });
});

