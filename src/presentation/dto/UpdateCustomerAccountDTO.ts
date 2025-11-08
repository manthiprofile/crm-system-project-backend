import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating a customer account.
 * All fields are optional.
 */
export class UpdateCustomerAccountDTO {
  @ApiPropertyOptional({
    description: 'Customer first name',
    example: 'Jane',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public firstName?: string;

  @ApiPropertyOptional({
    description: 'Customer last name',
    example: 'Smith',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public lastName?: string;

  @ApiPropertyOptional({
    description: 'Customer email address (must be unique)',
    example: 'jane.smith@example.com',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  public email?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '0987654321',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  public phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '456 New St',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  public address?: string;

  @ApiPropertyOptional({
    description: 'Customer city',
    example: 'Los Angeles',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  public city?: string;

  @ApiPropertyOptional({
    description: 'Customer state or province',
    example: 'CA',
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

