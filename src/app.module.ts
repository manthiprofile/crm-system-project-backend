import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CustomerAccountModule } from './presentation/customer-account.module';

@Module({
  imports: [DatabaseModule, CustomerAccountModule],
})
export class AppModule {}
