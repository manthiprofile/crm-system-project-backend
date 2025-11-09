import { Module } from '@nestjs/common';
import { ConfigModule } from './infrastructure/config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CustomerAccountModule } from './presentation/customer-account.module';

@Module({
  imports: [ConfigModule, DatabaseModule, CustomerAccountModule],
})
export class AppModule {}
