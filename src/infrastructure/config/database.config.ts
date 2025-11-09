import * as Joi from 'joi';

/**
 * Database configuration schema for environment variable validation.
 */
export const databaseConfigSchema = Joi.object({
  // Database Configuration
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().min(1).max(65535).default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_DATABASE: Joi.string().default('crm_system'),
  DB_SSL: Joi.boolean().default(false),
  DB_POOL_SIZE: Joi.number().min(1).max(100).default(10),
  DB_TIMEOUT: Joi.number().min(1000).default(10000),

  // Application Configuration
  PORT: Joi.number().min(1).max(65535).default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // CORS Configuration
  FRONTEND_ORIGIN: Joi.string().uri().default('http://localhost:5173'),
  CORS_ORIGINS: Joi.string().default('http://localhost:5173'),
});

