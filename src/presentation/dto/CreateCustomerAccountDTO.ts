import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a customer account.
 */
export class CreateCustomerAccountDTO {
  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public firstName!: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public lastName!: string;

  @ApiProperty({
    description: 'Customer email address (must be unique)',
    example: 'john.doe@example.com',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  public email!: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '1234567890',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  public phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '123 Main St',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  public address?: string;

  @ApiPropertyOptional({
    description: 'Customer city',
    example: 'New York',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  public city?: string;

  @ApiPropertyOptional({
    description: 'Customer state or province',
    example: 'NY',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  public state?: string;

  @ApiPropertyOptional({
    description: 'Customer country',
    example: 'USA',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  public country?: string;
}

