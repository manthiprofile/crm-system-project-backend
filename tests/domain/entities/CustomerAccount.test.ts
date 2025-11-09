import { describe, it, expect } from 'vitest';
import { CustomerAccount } from '@domain/entities/CustomerAccount';

describe('CustomerAccount', () => {
  describe('constructor', () => {
    it('should create a CustomerAccount with all required fields', () => {
      const account = new CustomerAccount(
        1,
        'John',
        'Doe',
        'john.doe@example.com',
      );

      expect(account.accountId).toBe(1);
      expect(account.firstName).toBe('John');
      expect(account.lastName).toBe('Doe');
      expect(account.email).toBe('john.doe@example.com');
      expect(account.dateCreated).toBeInstanceOf(Date);
    });

    it('should create a CustomerAccount with optional fields', () => {
      const account = new CustomerAccount(
        1,
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        '123 Main St',
        'New York',
        'NY',
        'USA',
      );

      expect(account.phoneNumber).toBe('1234567890');
      expect(account.address).toBe('123 Main St');
      expect(account.city).toBe('New York');
      expect(account.state).toBe('NY');
      expect(account.country).toBe('USA');
    });

    it('should use current date if dateCreated is not provided', () => {
      const beforeCreation = new Date();
      const account = new CustomerAccount(
        1,
        'John',
        'Doe',
        'john.doe@example.com',
      );
      const afterCreation = new Date();

      expect(account.dateCreated.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(account.dateCreated.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('getFullName', () => {
    it('should return the concatenated first and last name', () => {
      const account = new CustomerAccount(
        1,
        'John',
        'Doe',
        'john.doe@example.com',
      );

      expect(account.getFullName()).toBe('John Doe');
    });
  });

  describe('update', () => {
    it('should create a new CustomerAccount with updated fields', () => {
      const originalAccount = new CustomerAccount(
        1,
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
        '123 Main St',
        'New York',
        'NY',
        'USA',
      );

      const updatedAccount = originalAccount.update({
        firstName: 'Jane',
        city: 'Los Angeles',
      });

      expect(updatedAccount.accountId).toBe(originalAccount.accountId);
      expect(updatedAccount.firstName).toBe('Jane');
      expect(updatedAccount.lastName).toBe('Doe');
      expect(updatedAccount.email).toBe('john.doe@example.com');
      expect(updatedAccount.city).toBe('Los Angeles');
      expect(updatedAccount.state).toBe('NY');
      expect(updatedAccount.dateCreated).toEqual(originalAccount.dateCreated);
    });

    it('should preserve original values for fields not updated', () => {
      const originalAccount = new CustomerAccount(
        1,
        'John',
        'Doe',
        'john.doe@example.com',
        '1234567890',
      );

      const updatedAccount = originalAccount.update({
        address: '456 New St',
      });

      expect(updatedAccount.firstName).toBe('John');
      expect(updatedAccount.lastName).toBe('Doe');
      expect(updatedAccount.email).toBe('john.doe@example.com');
      expect(updatedAccount.phoneNumber).toBe('1234567890');
      expect(updatedAccount.address).toBe('456 New St');
    });
  });
});

