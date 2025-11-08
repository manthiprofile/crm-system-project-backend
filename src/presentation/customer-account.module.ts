import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { CustomerAccountController } from './controllers/CustomerAccountController';
import { CreateCustomerAccountUseCase } from '@usecases/createCustomerAccount/CreateCustomerAccountUseCase';
import { GetCustomerAccountUseCase } from '@usecases/getCustomerAccount/GetCustomerAccountUseCase';
import { ListCustomerAccountsUseCase } from '@usecases/listCustomerAccounts/ListCustomerAccountsUseCase';
import { UpdateCustomerAccountUseCase } from '@usecases/updateCustomerAccount/UpdateCustomerAccountUseCase';
import { DeleteCustomerAccountUseCase } from '@usecases/deleteCustomerAccount/DeleteCustomerAccountUseCase';

/**
 * Module for customer account presentation and use cases.
 */
@Module({
  imports: [DatabaseModule],
  controllers: [CustomerAccountController],
  providers: [
    CreateCustomerAccountUseCase,
    GetCustomerAccountUseCase,
    ListCustomerAccountsUseCase,
    UpdateCustomerAccountUseCase,
    DeleteCustomerAccountUseCase,
  ],
})
export class CustomerAccountModule {}

