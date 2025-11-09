import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListCustomerAccountsUseCase } from '@usecases/listCustomerAccounts/ListCustomerAccountsUseCase';
import { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CustomerAccount } from '@domain/entities/CustomerAccount';

describe('ListCustomerAccountsUseCase', () => {
  let useCase: ListCustomerAccountsUseCase;
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

    useCase = new ListCustomerAccountsUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return an empty array when no accounts exist', async () => {
      vi.mocked(mockRepository.findAll).mockResolvedValue([]);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return all customer accounts', async () => {
      const accounts = [
        new CustomerAccount(
          1,
          'John',
          'Doe',
          'john.doe@example.com',
        ),
        new CustomerAccount(
          2,
          'Jane',
          'Smith',
          'jane.smith@example.com',
        ),
      ];

      vi.mocked(mockRepository.findAll).mockResolvedValue(accounts);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(accounts);
      expect(result.length).toBe(2);
    });
  });
});

