import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetCustomerAccountUseCase } from '../GetCustomerAccountUseCase';
import { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';

describe('GetCustomerAccountUseCase', () => {
  let useCase: GetCustomerAccountUseCase;
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

    useCase = new GetCustomerAccountUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return a customer account when found', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const customerAccount = new CustomerAccount(
        accountId,
        'John',
        'Doe',
        'john.doe@example.com',
      );

      vi.mocked(mockRepository.findById).mockResolvedValue(customerAccount);

      const result = await useCase.execute(accountId);

      expect(mockRepository.findById).toHaveBeenCalledWith(accountId);
      expect(result).toEqual(customerAccount);
    });

    it('should throw CustomerAccountNotFoundException when account not found', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';

      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(useCase.execute(accountId)).rejects.toThrow(
        CustomerAccountNotFoundException,
      );
    });
  });
});

