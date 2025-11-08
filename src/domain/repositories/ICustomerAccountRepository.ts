import { CustomerAccount } from '../entities/CustomerAccount';

/**
 * Repository interface for CustomerAccount domain entity.
 * This interface defines the contract for data access operations.
 * Implementation should be in the infrastructure layer.
 */
export interface ICustomerAccountRepository {
  /**
   * Creates a new customer account in the repository.
   *
   * @param customerAccount - The customer account entity to create
   * @returns Promise resolving to the created customer account
   * @throws Error if creation fails
   */
  create(customerAccount: CustomerAccount): Promise<CustomerAccount>;

  /**
   * Finds a customer account by its unique identifier.
   *
   * @param accountId - The unique identifier of the account
   * @returns Promise resolving to the customer account or null if not found
   */
  findById(accountId: string): Promise<CustomerAccount | null>;

  /**
   * Retrieves all customer accounts from the repository.
   *
   * @returns Promise resolving to an array of all customer accounts
   */
  findAll(): Promise<CustomerAccount[]>;

  /**
   * Updates an existing customer account.
   *
   * @param accountId - The unique identifier of the account to update
   * @param customerAccount - Partial customer account with fields to update
   * @returns Promise resolving to the updated customer account
   * @throws Error if account not found or update fails
   */
  update(accountId: string, customerAccount: Partial<CustomerAccount>): Promise<CustomerAccount>;

  /**
   * Deletes a customer account by its unique identifier.
   *
   * @param accountId - The unique identifier of the account to delete
   * @returns Promise that resolves when deletion is complete
   * @throws Error if account not found or deletion fails
   */
  delete(accountId: string): Promise<void>;

  /**
   * Finds a customer account by email address.
   *
   * @param email - The email address to search for
   * @returns Promise resolving to the customer account or null if not found
   */
  findByEmail(email: string): Promise<CustomerAccount | null>;
}

