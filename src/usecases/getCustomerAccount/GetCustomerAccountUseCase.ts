import { Injectable, Inject } from '@nestjs/common';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import type { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CUSTOMER_ACCOUNT_REPOSITORY_TOKEN } from '@domain/repositories/repository.tokens';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';

/**
 * Use case for retrieving a single customer account by ID.
 */
@Injectable()
export class GetCustomerAccountUseCase {
  constructor(
    @Inject(CUSTOMER_ACCOUNT_REPOSITORY_TOKEN)
    private readonly customerAccountRepository: ICustomerAccountRepository,
  ) {}

  /**
   * Executes the get customer account use case.
   *
   * @param accountId - The unique identifier of the account to retrieve
   * @returns Promise resolving to the customer account
   * @throws CustomerAccountNotFoundException if account not found
   */
  public async execute(accountId: string): Promise<CustomerAccount> {
    const customerAccount = await this.customerAccountRepository.findById(
      accountId,
    );

    if (!customerAccount) {
      throw new CustomerAccountNotFoundException(accountId);
    }

    return customerAccount;
  }
}

