import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for customer account response.
 * Used to return customer account data to clients.
 */
export class CustomerAccountResponseDTO {
  @ApiProperty({
    description: 'Unique identifier for the customer account (serial ID)',
    example: 1,
  })
  public accountId!: number;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
  })
  public firstName!: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
  })
  public lastName!: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
  })
  public email!: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '1234567890',
  })
  public phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '123 Main St',
  })
  public address?: string;

  @ApiPropertyOptional({
    description: 'Customer city',
    example: 'New York',
  })
  public city?: string;

  @ApiPropertyOptional({
    description: 'Customer state or province',
    example: 'NY',
  })
  public state?: string;

  @ApiPropertyOptional({
    description: 'Customer country',
    example: 'USA',
  })
  public country?: string;

  @ApiProperty({
    description: 'Date and time when the account was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  public dateCreated!: Date;

  /**
   * Creates a CustomerAccountResponseDTO from a CustomerAccount domain entity.
   *
   * @param customerAccount - The domain entity to convert
   * @returns CustomerAccountResponseDTO instance
   */
  public static fromDomain(customerAccount: {
    accountId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    dateCreated: Date;
  }): CustomerAccountResponseDTO {
    const dto = new CustomerAccountResponseDTO();
    dto.accountId = customerAccount.accountId;
    dto.firstName = customerAccount.firstName;
    dto.lastName = customerAccount.lastName;
    dto.email = customerAccount.email;
    dto.phoneNumber = customerAccount.phoneNumber;
    dto.address = customerAccount.address;
    dto.city = customerAccount.city;
    dto.state = customerAccount.state;
    dto.country = customerAccount.country;
    dto.dateCreated = customerAccount.dateCreated;
    return dto;
  }
}

