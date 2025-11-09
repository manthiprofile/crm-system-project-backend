import { Injectable, Inject } from '@nestjs/common';
import type { ICustomerAccountRepository } from '@domain/repositories/ICustomerAccountRepository';
import { CUSTOMER_ACCOUNT_REPOSITORY_TOKEN } from '@domain/repositories/repository.tokens';
import { CustomerAccountNotFoundException } from '@domain/exceptions/CustomerAccountNotFoundException';

/**
 * Use case for deleting a customer account.
 */
@Injectable()
export class DeleteCustomerAccountUseCase {
  constructor(
    @Inject(CUSTOMER_ACCOUNT_REPOSITORY_TOKEN)
    private readonly customerAccountRepository: ICustomerAccountRepository,
  ) {}

  /**
   * Executes the delete customer account use case.
   *
   * @param accountId - The unique identifier of the account to delete
   * @returns Promise that resolves when deletion is complete
   * @throws CustomerAccountNotFoundException if account not found
   */
  public async execute(accountId: number): Promise<void> {
    const existingAccount = await this.customerAccountRepository.findById(
      accountId,
    );

    if (!existingAccount) {
      throw new CustomerAccountNotFoundException(accountId);
    }

    await this.customerAccountRepository.delete(accountId);
  }
}

