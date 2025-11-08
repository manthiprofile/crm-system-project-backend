import { Injectable, Inject } from '@nestjs/common';
import { CustomerAccount } from '@domain/entities/CustomerAccount';
import type { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CUSTOMER_ACCOUNT_REPOSITORY_TOKEN } from '@domain/repositories/repository.tokens';

/**
 * Use case for retrieving all customer accounts.
 */
@Injectable()
export class ListCustomerAccountsUseCase {
  constructor(
    @Inject(CUSTOMER_ACCOUNT_REPOSITORY_TOKEN)
    private readonly customerAccountRepository: ICustomerAccountRepository,
  ) {}

  /**
   * Executes the list customer accounts use case.
   *
   * @returns Promise resolving to an array of all customer accounts
   */
  public async execute(): Promise<CustomerAccount[]> {
    return await this.customerAccountRepository.findAll();
  }
}

