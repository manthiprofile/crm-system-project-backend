import { Injectable, Inject } from '@nestjs/common';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import type { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CUSTOMER_ACCOUNT_REPOSITORY_TOKEN } from '@domain/repositories/repository.tokens';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';
import { InvalidCustomerAccountException } from '@domain/exceptions/InvalidCustomerAccountException';

/**
 * DTO for updating a customer account.
 */
export interface UpdateCustomerAccountDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

/**
 * Use case for updating an existing customer account.
 */
@Injectable()
export class UpdateCustomerAccountUseCase {
  constructor(
    @Inject(CUSTOMER_ACCOUNT_REPOSITORY_TOKEN)
    private readonly customerAccountRepository: ICustomerAccountRepository,
  ) {}

  /**
   * Executes the update customer account use case.
   *
   * @param accountId - The unique identifier of the account to update
   * @param dto - Data transfer object containing fields to update
   * @returns Promise resolving to the updated customer account
   * @throws CustomerAccountNotFoundException if account not found
   * @throws InvalidCustomerAccountException if validation fails
   */
  public async execute(
    accountId: string,
    dto: UpdateCustomerAccountDTO,
  ): Promise<CustomerAccount> {
    const existingAccount = await this.customerAccountRepository.findById(
      accountId,
    );

    if (!existingAccount) {
      throw new CustomerAccountNotFoundException(accountId);
    }

    this.validateInput(dto);

    const updatedAccount = existingAccount.update(dto);
    return await this.customerAccountRepository.update(accountId, updatedAccount);
  }

  /**
   * Validates the input DTO.
   *
   * @param dto - The DTO to validate
   * @throws InvalidCustomerAccountException if validation fails
   */
  private validateInput(dto: UpdateCustomerAccountDTO): void {
    if (dto.firstName !== undefined && dto.firstName.trim().length === 0) {
      throw new InvalidCustomerAccountException('First name cannot be empty');
    }

    if (dto.lastName !== undefined && dto.lastName.trim().length === 0) {
      throw new InvalidCustomerAccountException('Last name cannot be empty');
    }

    if (dto.email !== undefined) {
      if (dto.email.trim().length === 0) {
        throw new InvalidCustomerAccountException('Email cannot be empty');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email)) {
        throw new InvalidCustomerAccountException('Invalid email format');
      }
    }
  }
}

