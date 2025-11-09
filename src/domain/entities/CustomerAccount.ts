/**
 * CustomerAccount domain entity representing a customer account in the system.
 * This is a pure domain entity with no infrastructure dependencies.
 */
export class CustomerAccount {
  public readonly accountId: number;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly phoneNumber?: string;
  public readonly address?: string;
  public readonly city?: string;
  public readonly state?: string;
  public readonly country?: string;
  public readonly dateCreated: Date;

  /**
   * Creates a new CustomerAccount instance.
   *
   * @param accountId - Unique identifier for the account (serial ID)
   * @param firstName - Customer's first name (required)
   * @param lastName - Customer's last name (required)
   * @param email - Customer's email address (required, unique)
   * @param phoneNumber - Customer's phone number (optional)
   * @param address - Customer's address (optional)
   * @param city - Customer's city (optional)
   * @param state - Customer's state (optional)
   * @param country - Customer's country (optional)
   * @param dateCreated - Date when the account was created (auto-generated)
   */
  constructor(
    accountId: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber?: string,
    address?: string,
    city?: string,
    state?: string,
    country?: string,
    dateCreated?: Date,
  ) {
    this.accountId = accountId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.city = city;
    this.state = state;
    this.country = country;
    this.dateCreated = dateCreated ?? new Date();
  }

  /**
   * Gets the full name of the customer.
   *
   * @returns The concatenated first and last name
   */
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Creates a new CustomerAccount with updated fields.
   *
   * @param updates - Partial object with fields to update
   * @returns A new CustomerAccount instance with updated fields
   */
  public update(updates: Partial<Omit<CustomerAccount, 'accountId' | 'dateCreated'>>): CustomerAccount {
    return new CustomerAccount(
      this.accountId,
      updates.firstName ?? this.firstName,
      updates.lastName ?? this.lastName,
      updates.email ?? this.email,
      updates.phoneNumber ?? this.phoneNumber,
      updates.address ?? this.address,
      updates.city ?? this.city,
      updates.state ?? this.state,
      updates.country ?? this.country,
      this.dateCreated,
    );
  }
}

