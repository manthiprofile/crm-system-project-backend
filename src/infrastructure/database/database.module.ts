import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAccountEntity } from './entities/CustomerAccountEntity';
import { CustomerAccountRepository } from './repositories/CustomerAccountRepository';
import { CUSTOMER_ACCOUNT_REPOSITORY_TOKEN } from '@domain/repositories/repository.tokens';

/**
 * Database module that configures TypeORM and provides repository implementations.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'crm_system',
      entities: [CustomerAccountEntity],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([CustomerAccountEntity]),
  ],
  providers: [
    CustomerAccountRepository,
    {
      provide: CUSTOMER_ACCOUNT_REPOSITORY_TOKEN,
      useExisting: CustomerAccountRepository,
    },
  ],
  exports: [CustomerAccountRepository, CUSTOMER_ACCOUNT_REPOSITORY_TOKEN],
})
export class DatabaseModule {}

