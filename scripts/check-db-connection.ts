import { Client } from 'pg';
import { config } from 'dotenv';

config();

/**
 * Database connection health check script.
 * Verifies database connectivity, existence, and basic query execution.
 */
async function checkDatabaseConnection(): Promise<void> {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
  const dbUsername = process.env.DB_USERNAME || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres';
  const dbName = process.env.DB_DATABASE || 'crm_system';

  console.log('\n=== Database Connection Health Check ===\n');
  console.log(`Host: ${dbHost}`);
  console.log(`Port: ${dbPort}`);
  console.log(`Username: ${dbUsername}`);
  console.log(`Database: ${dbName}\n`);

  const client = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: 'postgres', // Connect to postgres first to check if database exists
  });

  try {
    // Step 1: Test connection to PostgreSQL server
    console.log('Step 1: Testing PostgreSQL server connection...');
    await client.connect();
    console.log('✓ Successfully connected to PostgreSQL server\n');

    // Step 2: Check if database exists
    console.log(`Step 2: Checking if database '${dbName}' exists...`);
    const dbCheckResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName],
    );

    if (dbCheckResult.rows.length === 0) {
      console.log(`✗ Database '${dbName}' does not exist.`);
      console.log('  Run: npm run db:setup\n');
      await client.end();
      process.exit(1);
    }
    console.log(`✓ Database '${dbName}' exists\n`);

    // Step 3: Connect to the target database
    await client.end();
    const targetClient = new Client({
      host: dbHost,
      port: dbPort,
      user: dbUsername,
      password: dbPassword,
      database: dbName,
    });

    await targetClient.connect();
    console.log(`Step 3: Connected to database '${dbName}'\n`);

    // Step 4: Test basic query execution
    console.log('Step 4: Testing basic query execution...');
    const testQueryResult = await targetClient.query('SELECT NOW() as current_time');
    console.log(
      `✓ Query executed successfully. Current time: ${testQueryResult.rows[0].current_time}\n`,
    );

    // Step 5: Check if migrations have been run (check for customer_accounts table)
    console.log('Step 5: Checking if migrations have been run...');
    const tableCheckResult = await targetClient.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customer_accounts')",
    );

    if (tableCheckResult.rows[0].exists) {
      console.log('✓ Migrations have been run (customer_accounts table exists)\n');
    } else {
      console.log('⚠ Migrations have not been run yet.');
      console.log('  Run: npm run db:migrate\n');
    }

    // Step 6: Display connection pool information
    console.log('Step 6: Connection information...');
    const versionResult = await targetClient.query('SELECT version()');
    console.log(`✓ PostgreSQL version: ${versionResult.rows[0].version.split(',')[0]}\n`);

    await targetClient.end();

    console.log('=== All Checks Passed ===\n');
    console.log('Database is ready to use! ✓\n');
  } catch (error) {
    console.error('\n✗ Database connection check failed:\n');
    if (error instanceof Error) {
      console.error(`Error: ${error.message}\n`);
      if (error.message.includes('password authentication failed')) {
        console.error('Troubleshooting:');
        console.error('  - Check your DB_PASSWORD in .env file');
        console.error('  - Verify PostgreSQL user credentials\n');
      } else if (error.message.includes('does not exist')) {
        console.error('Troubleshooting:');
        console.error('  - Run: npm run db:setup\n');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('Troubleshooting:');
        console.error('  - Ensure PostgreSQL server is running');
        console.error('  - Check DB_HOST and DB_PORT in .env file\n');
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

checkDatabaseConnection();

