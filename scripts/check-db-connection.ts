import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { dataSourceOptions } from '../src/infrastructure/database/data-source';

/**
 * Database connection checker utility.
 * Verifies that the database connection is working before starting the application.
 */
config();

async function checkDatabaseConnection(): Promise<void> {
  const dataSource = new DataSource(dataSourceOptions);

  // Type assertion for PostgreSQL-specific options
  const pgOptions = dataSourceOptions as {
    host?: string;
    port?: number;
    username?: string;
    database?: string;
  };

  console.log('Checking database connection...');
  console.log(`Host: ${pgOptions.host || 'localhost'}:${pgOptions.port || 5432}`);
  console.log(`Database: ${pgOptions.database || 'crm_system'}`);
  console.log(`Username: ${pgOptions.username || 'postgres'}`);
  console.log('');

  try {
    await dataSource.initialize();
    console.log('✓ Database connection successful!');
    console.log('');

    // Check if UUID extension is enabled
    const result = await dataSource.query(
      "SELECT extname, extversion FROM pg_extension WHERE extname = 'uuid-ossp'",
    );

    if (result.length > 0) {
      console.log(`✓ UUID extension is enabled (version: ${result[0].extversion})`);
    } else {
      console.log('⚠ Warning: UUID extension is not enabled');
      console.log('  Run: npm run db:setup');
    }

    // Check if migrations have been run
    const migrationTableExists = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'typeorm_migrations'
      )
    `);

    if (migrationTableExists[0].exists) {
      const migrations = await dataSource.query(
        'SELECT * FROM typeorm_migrations ORDER BY timestamp DESC',
      );
      console.log(`✓ Migrations table exists (${migrations.length} migration(s) applied)`);
    } else {
      console.log('⚠ Warning: Migrations table does not exist');
      console.log('  Run: npm run migration:run');
    }

    // Check if customer_accounts table exists
    const tableExists = await dataSource.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'customer_accounts'
      )
    `);

    if (tableExists[0].exists) {
      const rowCount = await dataSource.query(
        'SELECT COUNT(*) as count FROM customer_accounts',
      );
      console.log(
        `✓ customer_accounts table exists (${rowCount[0].count} record(s))`,
      );
    } else {
      console.log('⚠ Warning: customer_accounts table does not exist');
      console.log('  Run: npm run migration:run');
    }

    await dataSource.destroy();
    console.log('');
    console.log('✓ All checks passed! Database is ready.');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database connection failed!');
    console.error('');
    console.error('Error details:');
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
    } else {
      console.error(`  ${String(error)}`);
    }
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1. Verify PostgreSQL is running');
    console.error('  2. Check your .env file configuration');
    console.error('  3. Ensure database credentials are correct');
    console.error('  4. Run: npm run db:setup');
    process.exit(1);
  }
}

checkDatabaseConnection();

