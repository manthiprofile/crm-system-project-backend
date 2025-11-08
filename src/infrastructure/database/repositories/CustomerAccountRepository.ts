import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CustomerAccountEntity } from '../entities/CustomerAccountEntity';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';
import { DuplicateEmailException } from '@domain/exceptions/DuplicateEmailException';

/**
 * TypeORM implementation of ICustomerAccountRepository.
 * Handles all database operations for CustomerAccount entities.
 */
@Injectable()
export class CustomerAccountRepository implements ICustomerAccountRepository {
  constructor(
    @InjectRepository(CustomerAccountEntity)
    private readonly repository: Repository<CustomerAccountEntity>,
  ) {}

  /**
   * Creates a new customer account in the repository.
   *
   * @param customerAccount - The customer account entity to create
   * @returns Promise resolving to the created customer account
   * @throws DuplicateEmailException if email already exists
   */
  public async create(customerAccount: CustomerAccount): Promise<CustomerAccount> {
    const existingAccount = await this.findByEmail(customerAccount.email);
    if (existingAccount) {
      throw new DuplicateEmailException(customerAccount.email);
    }

    const entity = CustomerAccountEntity.fromDomain(customerAccount);
    const savedEntity = await this.repository.save(entity);
    return savedEntity.toDomain();
  }

  /**
   * Finds a customer account by its unique identifier.
   *
   * @param accountId - The unique identifier of the account
   * @returns Promise resolving to the customer account or null if not found
   */
  public async findById(accountId: string): Promise<CustomerAccount | null> {
    const entity = await this.repository.findOne({
      where: { accountId },
    });

    if (!entity) {
      return null;
    }

    return entity.toDomain();
  }

  /**
   * Retrieves all customer accounts from the repository.
   *
   * @returns Promise resolving to an array of all customer accounts
   */
  public async findAll(): Promise<CustomerAccount[]> {
    const entities = await this.repository.find({
      order: { dateCreated: 'DESC' },
    });
    return entities.map((entity) => entity.toDomain());
  }

  /**
   * Updates an existing customer account.
   *
   * @param accountId - The unique identifier of the account to update
   * @param customerAccount - Partial customer account with fields to update
   * @returns Promise resolving to the updated customer account
   * @throws CustomerAccountNotFoundException if account not found
   * @throws DuplicateEmailException if email already exists
   */
  public async update(
    accountId: string,
    customerAccount: Partial<CustomerAccount>,
  ): Promise<CustomerAccount> {
    const existingEntity = await this.repository.findOne({
      where: { accountId },
    });

    if (!existingEntity) {
      throw new CustomerAccountNotFoundException(accountId);
    }

    if (customerAccount.email && customerAccount.email !== existingEntity.email) {
      const emailExists = await this.findByEmail(customerAccount.email);
      if (emailExists) {
        throw new DuplicateEmailException(customerAccount.email);
      }
    }

    Object.assign(existingEntity, {
      firstName: customerAccount.firstName ?? existingEntity.firstName,
      lastName: customerAccount.lastName ?? existingEntity.lastName,
      email: customerAccount.email ?? existingEntity.email,
      phoneNumber: customerAccount.phoneNumber ?? existingEntity.phoneNumber,
      address: customerAccount.address ?? existingEntity.address,
      city: customerAccount.city ?? existingEntity.city,
      state: customerAccount.state ?? existingEntity.state,
      country: customerAccount.country ?? existingEntity.country,
    });

    const updatedEntity = await this.repository.save(existingEntity);
    return updatedEntity.toDomain();
  }

  /**
   * Deletes a customer account by its unique identifier.
   *
   * @param accountId - The unique identifier of the account to delete
   * @returns Promise that resolves when deletion is complete
   * @throws CustomerAccountNotFoundException if account not found
   */
  public async delete(accountId: string): Promise<void> {
    const entity = await this.repository.findOne({
      where: { accountId },
    });

    if (!entity) {
      throw new CustomerAccountNotFoundException(accountId);
    }

    await this.repository.remove(entity);
  }

  /**
   * Finds a customer account by email address.
   *
   * @param email - The email address to search for
   * @returns Promise resolving to the customer account or null if not found
   */
  public async findByEmail(email: string): Promise<CustomerAccount | null> {
    const entity = await this.repository.findOne({
      where: { email },
    });

    if (!entity) {
      return null;
    }

    return entity.toDomain();
  }
}

