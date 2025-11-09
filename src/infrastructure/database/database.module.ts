import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomerAccountEntity } from './entities/CustomerAccountEntity';
import { CustomerAccountRepository } from './repositories/CustomerAccountRepository';
import { CUSTOMER_ACCOUNT_REPOSITORY_TOKEN } from '@domain/repositories/repository.tokens';

/**
 * Database module that configures TypeORM with connection pooling,
 * retry logic, SSL support, and provides repository implementations.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
        const sslEnabled = configService.get<string>('DB_SSL') === 'true';

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_DATABASE', 'crm_system'),
          entities: [CustomerAccountEntity],
          synchronize: isDevelopment,
          logging: isDevelopment,
          ssl: sslEnabled
            ? {
                rejectUnauthorized: false,
              }
            : false,
          extra: {
            max: configService.get<number>('DB_POOL_SIZE', 10),
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: configService.get<number>('DB_TIMEOUT', 10000),
          },
          retryAttempts: 3,
          retryDelay: 3000,
          autoLoadEntities: true,
        };
      },
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

