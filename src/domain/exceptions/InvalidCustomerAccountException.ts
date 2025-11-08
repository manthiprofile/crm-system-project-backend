/**
 * Exception thrown when customer account data is invalid.
 */
export class InvalidCustomerAccountException extends Error {
  /**
   * Creates a new InvalidCustomerAccountException.
   *
   * @param message - The error message describing the validation failure
   */
  constructor(message: string) {
    super(`Invalid customer account: ${message}`);
    this.name = 'InvalidCustomerAccountException';
    Object.setPrototypeOf(this, InvalidCustomerAccountException.prototype);
  }
}

