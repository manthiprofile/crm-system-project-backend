import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './presentation/filters/HttpExceptionFilter';
import { ConfigService } from '@nestjs/config';

/**
 * Bootstraps the NestJS application.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS with environment-based configuration
  const frontendOrigin = configService.get<string>('FRONTEND_ORIGIN', 'http://localhost:5173');
  const corsOrigins = configService.get<string>('CORS_ORIGINS', frontendOrigin);
  const allowedOrigins = corsOrigins.split(',').map((origin) => origin.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API Documentation Configuration
  const config = new DocumentBuilder()
    .setTitle('CRM Customer Account Management API')
    .setDescription(
      'A comprehensive REST API for managing customer accounts. This API provides full CRUD operations for customer account management with validation, error handling, and clean architecture principles.',
    )
    .setVersion('1.0')
    .addTag('customer-accounts', 'Customer account management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger API documentation: http://localhost:${port}/api`);
  console.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}
bootstrap();
