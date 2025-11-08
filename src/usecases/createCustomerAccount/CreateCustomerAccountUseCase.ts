import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import type { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CUSTOMER_ACCOUNT_REPOSITORY_TOKEN } from '@domain/repositories/repository.tokens';
import { DuplicateEmailException } from '@domain/exceptions/DuplicateEmailException';
import { InvalidCustomerAccountException } from '@domain/exceptions/InvalidCustomerAccountException';

/**
 * DTO for creating a customer account.
 */
export interface CreateCustomerAccountDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

/**
 * Use case for creating a new customer account.
 * Validates input, checks for duplicate emails, and creates the account.
 */
@Injectable()
export class CreateCustomerAccountUseCase {
  constructor(
    @Inject(CUSTOMER_ACCOUNT_REPOSITORY_TOKEN)
    private readonly customerAccountRepository: ICustomerAccountRepository,
  ) {}

  /**
   * Executes the create customer account use case.
   *
   * @param dto - Data transfer object containing customer account information
   * @returns Promise resolving to the created customer account
   * @throws DuplicateEmailException if email already exists
   * @throws InvalidCustomerAccountException if validation fails
   */
  public async execute(dto: CreateCustomerAccountDTO): Promise<CustomerAccount> {
    this.validateInput(dto);

    const existingAccount = await this.customerAccountRepository.findByEmail(
      dto.email,
    );

    if (existingAccount) {
      throw new DuplicateEmailException(dto.email);
    }

    const customerAccount = new CustomerAccount(
      uuidv4(),
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.phoneNumber,
      dto.address,
      dto.city,
      dto.state,
      dto.country,
    );

    return await this.customerAccountRepository.create(customerAccount);
  }

  /**
   * Validates the input DTO.
   *
   * @param dto - The DTO to validate
   * @throws InvalidCustomerAccountException if validation fails
   */
  private validateInput(dto: CreateCustomerAccountDTO): void {
    if (!dto.firstName || dto.firstName.trim().length === 0) {
      throw new InvalidCustomerAccountException('First name is required');
    }

    if (!dto.lastName || dto.lastName.trim().length === 0) {
      throw new InvalidCustomerAccountException('Last name is required');
    }

    if (!dto.email || dto.email.trim().length === 0) {
      throw new InvalidCustomerAccountException('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      throw new InvalidCustomerAccountException('Invalid email format');
    }
  }
}

