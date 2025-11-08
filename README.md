# CRM Customer Account Management System

A comprehensive CRUD application for managing customer accounts, built with NestJS, TypeORM, and following clean architecture principles.

## Features

- **Customer Account CRUD Operations**: Create, read, update, and delete customer accounts
- **Clean Architecture**: Domain, use cases, infrastructure, and presentation layers with clear separation of concerns
- **Type Safety**: Full TypeScript support with strict type checking
- **Validation**: Request validation using class-validator
- **Error Handling**: Comprehensive error handling with custom domain exceptions
- **API Documentation**: Interactive Swagger/OpenAPI documentation with testing interface
- **Testing**: Unit tests (Vitest) and E2E tests (Playwright) with 80% coverage target
- **Architecture Tests**: Automated tests to ensure clean architecture patterns are maintained

## Tech Stack

- **Runtime**: Node.js 24.11.0
- **Framework**: NestJS
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **API Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## Project Structure

```
src/
├── domain/              # Domain layer (entities, repository interfaces, exceptions)
├── usecases/           # Use cases layer (business logic)
├── infrastructure/     # Infrastructure layer (database, external services)
└── presentation/       # Presentation layer (controllers, DTOs, filters)
```

## Prerequisites

- Node.js 24.11.0 or higher
- PostgreSQL 12 or higher
- npm or yarn

### Installing PostgreSQL

**Windows:**
- Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- Run the installer and remember the password you set for the `postgres` user
- Default port: `5432`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crm-system-project-backend
```

2. Install dependencies:
```bash
npm install
```

3. **Set up the database** (see [Database Setup](#database-setup) section below):
```bash
# Quick setup (automated)
npm run db:setup

# Or manually (see Database Setup section)
```

4. Create a `.env` file in the root directory:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and update with your PostgreSQL credentials
```

5. Run database migrations:
```bash
npm run migration:run
```

6. (Optional) Verify database connection:
```bash
npm run db:check
```

## Database Setup

### Quick Setup (Recommended)

The easiest way to set up the database is using the automated script:

```bash
npm run db:setup
```

This script will:
- Check if PostgreSQL is running
- Create the `crm_system` database if it doesn't exist
- Enable the UUID extension required for the application
- Verify the setup

**Note:** Make sure PostgreSQL is running before executing this command.

### Manual Setup

If you prefer to set up the database manually:

#### Step 1: Create the Database

**Using psql (Command Line):**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE crm_system;

# Connect to the new database
\c crm_system

# Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Exit psql
\q
```

**Using SQL Script:**
```bash
# Linux/macOS
psql -U postgres -f scripts/setup-database.sql

# Windows (PowerShell)
psql -U postgres -f scripts\setup-database.sql
```

#### Step 2: Configure Environment Variables

Copy `.env.example` to `.env` and update the database credentials:

```bash
cp .env.example .env
```

Edit `.env` and update:
- `DB_PASSWORD` - Your PostgreSQL password
- `DB_USERNAME` - Your PostgreSQL username (default: `postgres`)
- Other settings if needed

#### Step 3: Run Migrations

```bash
npm run migration:run
```

This will create all necessary tables in the database.

### Platform-Specific Setup

#### Windows

1. Ensure PostgreSQL service is running (check Services: `services.msc`)
2. Run the setup script:
```powershell
npm run db:setup
```

Or manually:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-database.ps1
```

#### macOS / Linux

1. Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

2. Run the setup script:
```bash
npm run db:setup
```

Or manually:
```bash
bash scripts/setup-database.sh
```

### Database Setup Commands

| Command | Description |
|---------|-------------|
| `npm run db:setup` | Automated database setup (creates DB and enables extensions) |
| `npm run db:create` | Alias for `db:setup` |
| `npm run db:migrate` | Run database migrations (creates tables) |
| `npm run db:check` | Verify database connection and setup |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert the last migration |

### Troubleshooting

**PostgreSQL is not running:**
- **Windows:** Start PostgreSQL service from Services (`services.msc`)
- **macOS:** `brew services start postgresql@15`
- **Linux:** `sudo systemctl start postgresql`

**Connection refused:**
- Verify PostgreSQL is running on the correct port (default: 5432)
- Check firewall settings
- Verify credentials in `.env` file

**Database already exists:**
- The setup script is idempotent - safe to run multiple times
- If you need to start fresh: `npm run db:reset` (drops and recreates)

**UUID extension error:**
- Ensure you're connected to the `crm_system` database
- Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

**Permission denied:**
- Ensure your PostgreSQL user has CREATE DATABASE privileges
- On Linux, you may need to use `sudo -u postgres psql`

### Verify Setup

After setup, verify everything is working:

```bash
# Check database connection
npm run db:check

# This will verify:
# - Database connection
# - UUID extension is enabled
# - Migrations have been run
# - Tables exist
```

## Environment Variables

The project includes a `.env.example` file with all required environment variables. To set up your environment:

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` and update the values, especially:
   - `DB_PASSWORD` - Your PostgreSQL password
   - `DB_USERNAME` - Your PostgreSQL username (if different from `postgres`)

**Example `.env` file:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=crm_system

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Environment Variables Description

- **DB_HOST**: PostgreSQL database host (default: localhost)
- **DB_PORT**: PostgreSQL database port (default: 5432)
- **DB_USERNAME**: Database username (default: postgres)
- **DB_PASSWORD**: Database password (default: postgres)
- **DB_DATABASE**: Database name (default: crm_system)
- **PORT**: Application server port (default: 3000)
- **NODE_ENV**: Environment mode - development, production, or test

## Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The application will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## API Documentation (Swagger)

The project includes comprehensive Swagger/OpenAPI documentation. Once the application is running, you can access the interactive API documentation at:

**Swagger UI**: `http://localhost:3000/api`

The Swagger documentation provides:
- Complete API endpoint descriptions
- Request/response schemas
- Example payloads
- Error response documentation
- Interactive API testing interface

You can test all endpoints directly from the Swagger UI without needing external tools like Postman.

## API Endpoints

### Customer Accounts

#### Create Customer Account
```http
POST /customer-accounts
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",  // optional
  "address": "123 Main St",      // optional
  "city": "New York",            // optional
  "state": "NY",                 // optional
  "country": "USA"               // optional
}
```

#### Get All Customer Accounts
```http
GET /customer-accounts
```

#### Get Customer Account by ID
```http
GET /customer-accounts/:id
```

#### Update Customer Account
```http
PATCH /customer-accounts/:id
Content-Type: application/json

{
  "firstName": "Jane",           // optional
  "lastName": "Smith",           // optional
  "email": "jane.smith@example.com", // optional
  "phoneNumber": "0987654321",   // optional
  "address": "456 New St",       // optional
  "city": "Los Angeles",         // optional
  "state": "CA",                 // optional
  "country": "USA"               // optional
}
```

#### Delete Customer Account
```http
DELETE /customer-accounts/:id
```

## Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Architecture Tests

Architecture tests ensure that clean architecture dependency rules are not violated:

```bash
npm run test
```

The architecture tests verify:
- Domain layer doesn't depend on infrastructure or presentation
- Use cases don't depend on presentation
- Infrastructure doesn't depend on presentation

## Database Migrations

```bash
# Generate a new migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## API Documentation

The project uses Swagger/OpenAPI for API documentation. The Swagger UI is automatically available when the application is running:

- **Swagger UI**: `http://localhost:3000/api`
- **JSON Schema**: `http://localhost:3000/api-json`

The documentation includes:
- All CRUD endpoints with detailed descriptions
- Request/response schemas with examples
- Error response documentation
- Interactive testing interface

All DTOs and controllers are decorated with Swagger annotations for comprehensive API documentation.

## Architecture

This project follows Clean Architecture principles with the following layers:

1. **Domain Layer**: Contains entities, repository interfaces, and domain exceptions. No dependencies on other layers.

2. **Use Cases Layer**: Contains business logic and use cases. Depends only on the domain layer.

3. **Infrastructure Layer**: Contains database implementations, external service integrations. Depends on domain layer.

4. **Presentation Layer**: Contains controllers, DTOs, and filters. Depends on use cases and infrastructure layers.

## Data Model

### Customer Account

- **accountId**: UUID (Primary Key, auto-generated)
- **firstName**: String (Required)
- **lastName**: String (Required)
- **email**: String (Required, Unique)
- **phoneNumber**: String (Optional)
- **address**: String (Optional)
- **city**: String (Optional)
- **state**: String (Optional)
- **country**: String (Optional)
- **dateCreated**: Timestamp (Auto-generated)

## Error Handling

The application uses custom domain exceptions:

- `CustomerAccountNotFoundException`: Thrown when a customer account is not found (HTTP 404)
- `DuplicateEmailException`: Thrown when attempting to create/update with an existing email (HTTP 409)
- `InvalidCustomerAccountException`: Thrown when validation fails (HTTP 400)

## Contributing

1. Follow the coding standards defined in `.cursor/rules/backend-rule.mdc`
2. Maintain 80% test coverage
3. Ensure all tests pass before submitting
4. Run ESLint and fix any violations
5. Follow clean architecture principles

## License

This project is private and proprietary.
