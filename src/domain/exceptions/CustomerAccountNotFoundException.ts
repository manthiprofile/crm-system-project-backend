/**
 * Exception thrown when a customer account is not found.
 */
export class CustomerAccountNotFoundException extends Error {
  /**
   * Creates a new CustomerAccountNotFoundException.
   *
   * @param accountId - The account ID that was not found
   */
  constructor(accountId: number) {
    super(`Customer account with ID ${accountId} not found`);
    this.name = 'CustomerAccountNotFoundException';
    Object.setPrototypeOf(this, CustomerAccountNotFoundException.prototype);
  }
}

