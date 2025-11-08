import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CreateCustomerAccountUseCase } from '@usecases/createCustomerAccount/CreateCustomerAccountUseCase';
import { GetCustomerAccountUseCase } from '@usecases/getCustomerAccount/GetCustomerAccountUseCase';
import { ListCustomerAccountsUseCase } from '@usecases/listCustomerAccounts/ListCustomerAccountsUseCase';
import { UpdateCustomerAccountUseCase } from '@usecases/updateCustomerAccount/UpdateCustomerAccountUseCase';
import { DeleteCustomerAccountUseCase } from '@usecases/deleteCustomerAccount/DeleteCustomerAccountUseCase';
import { CreateCustomerAccountDTO } from '../dto/CreateCustomerAccountDTO';
import { UpdateCustomerAccountDTO } from '../dto/UpdateCustomerAccountDTO';
import { CustomerAccountResponseDTO } from '../dto/CustomerAccountResponseDTO';
import { ErrorResponseDTO } from '../dto/ErrorResponseDTO';

/**
 * Controller for customer account CRUD operations.
 */
@ApiTags('customer-accounts')
@Controller('customer-accounts')
export class CustomerAccountController {
  constructor(
    private readonly createCustomerAccountUseCase: CreateCustomerAccountUseCase,
    private readonly getCustomerAccountUseCase: GetCustomerAccountUseCase,
    private readonly listCustomerAccountsUseCase: ListCustomerAccountsUseCase,
    private readonly updateCustomerAccountUseCase: UpdateCustomerAccountUseCase,
    private readonly deleteCustomerAccountUseCase: DeleteCustomerAccountUseCase,
  ) {}

  /**
   * Creates a new customer account.
   *
   * @param dto - Data transfer object containing customer account information
   * @returns Promise resolving to the created customer account
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new customer account',
    description: 'Creates a new customer account with the provided information. Email must be unique.',
  })
  @ApiBody({ type: CreateCustomerAccountDTO })
  @ApiCreatedResponse({
    description: 'Customer account successfully created',
    type: CustomerAccountResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation failed',
    type: ErrorResponseDTO,
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    type: ErrorResponseDTO,
  })
  public async create(
    @Body() dto: CreateCustomerAccountDTO,
  ): Promise<CustomerAccountResponseDTO> {
    const customerAccount = await this.createCustomerAccountUseCase.execute({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      country: dto.country,
    });

    return CustomerAccountResponseDTO.fromDomain(customerAccount);
  }

  /**
   * Retrieves all customer accounts.
   *
   * @returns Promise resolving to an array of customer accounts
   */
  @Get()
  @ApiOperation({
    summary: 'Get all customer accounts',
    description: 'Retrieves a list of all customer accounts in the system, ordered by creation date (newest first).',
  })
  @ApiOkResponse({
    description: 'List of customer accounts retrieved successfully',
    type: [CustomerAccountResponseDTO],
  })
  public async findAll(): Promise<CustomerAccountResponseDTO[]> {
    const customerAccounts = await this.listCustomerAccountsUseCase.execute();
    return customerAccounts.map((account) =>
      CustomerAccountResponseDTO.fromDomain(account),
    );
  }

  /**
   * Retrieves a single customer account by ID.
   *
   * @param id - The unique identifier of the account
   * @returns Promise resolving to the customer account
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a customer account by ID',
    description: 'Retrieves a single customer account by its unique identifier (UUID).',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer account UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Customer account retrieved successfully',
    type: CustomerAccountResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Customer account not found',
    type: ErrorResponseDTO,
  })
  public async findOne(
    @Param('id') id: string,
  ): Promise<CustomerAccountResponseDTO> {
    const customerAccount = await this.getCustomerAccountUseCase.execute(id);
    return CustomerAccountResponseDTO.fromDomain(customerAccount);
  }

  /**
   * Updates an existing customer account.
   *
   * @param id - The unique identifier of the account to update
   * @param dto - Data transfer object containing fields to update
   * @returns Promise resolving to the updated customer account
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a customer account',
    description: 'Updates an existing customer account. Only provided fields will be updated. All fields are optional.',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer account UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCustomerAccountDTO })
  @ApiOkResponse({
    description: 'Customer account updated successfully',
    type: CustomerAccountResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Customer account not found',
    type: ErrorResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation failed',
    type: ErrorResponseDTO,
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    type: ErrorResponseDTO,
  })
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerAccountDTO,
  ): Promise<CustomerAccountResponseDTO> {
    const customerAccount = await this.updateCustomerAccountUseCase.execute(
      id,
      {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
      },
    );

    return CustomerAccountResponseDTO.fromDomain(customerAccount);
  }

  /**
   * Deletes a customer account by ID.
   *
   * @param id - The unique identifier of the account to delete
   * @returns Promise that resolves when deletion is complete
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a customer account',
    description: 'Permanently deletes a customer account by its unique identifier (UUID).',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer account UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Customer account successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Customer account not found',
    type: ErrorResponseDTO,
  })
  public async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCustomerAccountUseCase.execute(id);
  }
}

