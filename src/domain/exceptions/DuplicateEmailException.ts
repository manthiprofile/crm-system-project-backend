/**
 * Exception thrown when attempting to create or update a customer account
 * with an email that already exists in the system.
 */
export class DuplicateEmailException extends Error {
  /**
   * Creates a new DuplicateEmailException.
   *
   * @param email - The email address that already exists
   */
  constructor(email: string) {
    super(`Customer account with email ${email} already exists`);
    this.name = 'DuplicateEmailException';
    Object.setPrototypeOf(this, DuplicateEmailException.prototype);
  }
}

