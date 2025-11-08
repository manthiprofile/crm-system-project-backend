import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Repository } from 'typeorm';
import { CustomerAccountRepository } from '@infrastructure/database/repositories/CustomerAccountRepository';
import { CustomerAccountEntity } from '@infrastructure/database/entities/CustomerAccountEntity';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';
import { DuplicateEmailException } from '@domain/exceptions/DuplicateEmailException';

describe('CustomerAccountRepository', () => {
  let repository: CustomerAccountRepository;
  let mockTypeOrmRepository: Repository<CustomerAccountEntity>;

  beforeEach(() => {
    mockTypeOrmRepository = {
      save: vi.fn(),
      findOne: vi.fn(),
      find: vi.fn(),
      remove: vi.fn(),
    } as unknown as Repository<CustomerAccountEntity>;

    repository = new CustomerAccountRepository(mockTypeOrmRepository);
  });

  describe('create', () => {
    it('should create a customer account successfully', async () => {
      const customerAccount = new CustomerAccount(
        '123e4567-e89b-12d3-a456-426614174000',
        'John',
        'Doe',
        'john.doe@example.com',
      );

      const entity = CustomerAccountEntity.fromDomain(customerAccount);
      entity.dateCreated = new Date();

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(null);
      vi.mocked(mockTypeOrmRepository.save).mockResolvedValue(entity);

      const result = await repository.create(customerAccount);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: customerAccount.email },
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(CustomerAccount);
      expect(result.email).toBe(customerAccount.email);
    });

    it('should throw DuplicateEmailException if email already exists', async () => {
      const customerAccount = new CustomerAccount(
        '123e4567-e89b-12d3-a456-426614174000',
        'John',
        'Doe',
        'existing@example.com',
      );

      const existingEntity = CustomerAccountEntity.fromDomain(
        new CustomerAccount(
          '223e4567-e89b-12d3-a456-426614174001',
          'Jane',
          'Smith',
          'existing@example.com',
        ),
      );

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(existingEntity);

      await expect(repository.create(customerAccount)).rejects.toThrow(
        DuplicateEmailException,
      );
      expect(mockTypeOrmRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a customer account when found', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const entity = CustomerAccountEntity.fromDomain(
        new CustomerAccount(accountId, 'John', 'Doe', 'john.doe@example.com'),
      );

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(entity);

      const result = await repository.findById(accountId);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { accountId },
      });
      expect(result).toBeInstanceOf(CustomerAccount);
      expect(result?.accountId).toBe(accountId);
    });

    it('should return null when account not found', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(null);

      const result = await repository.findById(accountId);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all customer accounts', async () => {
      const entities = [
        CustomerAccountEntity.fromDomain(
          new CustomerAccount(
            '123e4567-e89b-12d3-a456-426614174000',
            'John',
            'Doe',
            'john.doe@example.com',
          ),
        ),
        CustomerAccountEntity.fromDomain(
          new CustomerAccount(
            '223e4567-e89b-12d3-a456-426614174001',
            'Jane',
            'Smith',
            'jane.smith@example.com',
          ),
        ),
      ];

      vi.mocked(mockTypeOrmRepository.find).mockResolvedValue(entities);

      const result = await repository.findAll();

      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        order: { dateCreated: 'DESC' },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(CustomerAccount);
    });
  });

  describe('update', () => {
    it('should update a customer account successfully', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const existingEntity = CustomerAccountEntity.fromDomain(
        new CustomerAccount(accountId, 'John', 'Doe', 'john.doe@example.com'),
      );

      const updatedCustomerAccount = new CustomerAccount(
        accountId,
        'Jane',
        'Doe',
        'john.doe@example.com',
      );

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(existingEntity);
      vi.mocked(mockTypeOrmRepository.save).mockResolvedValue(
        CustomerAccountEntity.fromDomain(updatedCustomerAccount),
      );

      const result = await repository.update(accountId, {
        firstName: 'Jane',
      });

      expect(result.firstName).toBe('Jane');
    });

    it('should throw CustomerAccountNotFoundException when account not found', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(null);

      await expect(
        repository.update(accountId, { firstName: 'Jane' }),
      ).rejects.toThrow(CustomerAccountNotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a customer account successfully', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      const entity = CustomerAccountEntity.fromDomain(
        new CustomerAccount(accountId, 'John', 'Doe', 'john.doe@example.com'),
      );

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(entity);
      vi.mocked(mockTypeOrmRepository.remove).mockResolvedValue(entity);

      await repository.delete(accountId);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { accountId },
      });
      expect(mockTypeOrmRepository.remove).toHaveBeenCalledWith(entity);
    });

    it('should throw CustomerAccountNotFoundException when account not found', async () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(null);

      await expect(repository.delete(accountId)).rejects.toThrow(
        CustomerAccountNotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a customer account when found by email', async () => {
      const email = 'john.doe@example.com';
      const entity = CustomerAccountEntity.fromDomain(
        new CustomerAccount(
          '123e4567-e89b-12d3-a456-426614174000',
          'John',
          'Doe',
          email,
        ),
      );

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(entity);

      const result = await repository.findByEmail(email);

      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeInstanceOf(CustomerAccount);
      expect(result?.email).toBe(email);
    });

    it('should return null when account not found by email', async () => {
      const email = 'notfound@example.com';

      vi.mocked(mockTypeOrmRepository.findOne).mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
    });
  });
});

