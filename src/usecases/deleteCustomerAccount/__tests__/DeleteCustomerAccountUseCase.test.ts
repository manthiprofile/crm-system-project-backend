import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteCustomerAccountUseCase } from '../DeleteCustomerAccountUseCase';
import { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';

describe('DeleteCustomerAccountUseCase', () => {
  let useCase: DeleteCustomerAccountUseCase;
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

    useCase = new DeleteCustomerAccountUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should delete a customer account successfully', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const customerAccount = new CustomerAccount(
        accountId,
        'John',
        'Doe',
        'john.doe@example.com',
      );

      vi.mocked(mockRepository.findById).mockResolvedValue(customerAccount);
      vi.mocked(mockRepository.delete).mockResolvedValue(undefined);

      await useCase.execute(accountId);

      expect(mockRepository.findById).toHaveBeenCalledWith(accountId);
      expect(mockRepository.delete).toHaveBeenCalledWith(accountId);
    });

    it('should throw CustomerAccountNotFoundException when account not found', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';

      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(useCase.execute(accountId)).rejects.toThrow(
        CustomerAccountNotFoundException,
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});

