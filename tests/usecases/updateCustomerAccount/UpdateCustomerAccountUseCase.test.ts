import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateCustomerAccountUseCase } from '@usecases/updateCustomerAccount/UpdateCustomerAccountUseCase';
import { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';
import { InvalidCustomerAccountException } from '@domain/exceptions/InvalidCustomerAccountException';

describe('UpdateCustomerAccountUseCase', () => {
  let useCase: UpdateCustomerAccountUseCase;
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

    useCase = new UpdateCustomerAccountUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should update a customer account successfully', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const existingAccount = new CustomerAccount(
        accountId,
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
      );

      const dto = {
        firstName: 'Jane',
        city: 'Los Angeles',
      };

      const updatedAccount = existingAccount.update(dto);

      vi.mocked(mockRepository.findById).mockResolvedValue(existingAccount);
      vi.mocked(mockRepository.update).mockResolvedValue(updatedAccount);

      const result = await useCase.execute(accountId, dto);

      expect(mockRepository.findById).toHaveBeenCalledWith(accountId);
      expect(mockRepository.update).toHaveBeenCalled();
      expect(result.firstName).toBe('Jane');
      expect(result.city).toBe('Los Angeles');
    });

    it('should throw CustomerAccountNotFoundException when account not found', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { firstName: 'Jane' };

      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(useCase.execute(accountId, dto)).rejects.toThrow(
        CustomerAccountNotFoundException,
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw InvalidCustomerAccountException if firstName is empty', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const existingAccount = new CustomerAccount(
        accountId,
        'John',
        'Doe',
        'john.doe@example.com',
      );

      const dto = { firstName: '' };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingAccount);

      await expect(useCase.execute(accountId, dto)).rejects.toThrow(
        InvalidCustomerAccountException,
      );
    });

    it('should throw InvalidCustomerAccountException if email format is invalid', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const existingAccount = new CustomerAccount(
        accountId,
        'John',
        'Doe',
        'john.doe@example.com',
      );

      const dto = { email: 'invalid-email' };

      vi.mocked(mockRepository.findById).mockResolvedValue(existingAccount);

      await expect(useCase.execute(accountId, dto)).rejects.toThrow(
        InvalidCustomerAccountException,
      );
    });
  });
});

