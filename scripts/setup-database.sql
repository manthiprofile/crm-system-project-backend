-- SQL script to manually set up PostgreSQL database for CRM System
-- This script creates the database and enables the UUID extension
--
-- Usage:
--   psql -U postgres -f scripts/setup-database.sql
--
-- Or connect to PostgreSQL and run the commands manually:
--   psql -U postgres
--   \i scripts/setup-database.sql

-- Create database if it doesn't exist
-- Note: CREATE DATABASE cannot be executed within a transaction block
-- If the database already exists, you'll get an error which can be ignored

SELECT 'Creating database crm_system...' AS status;

-- Connect to postgres database to create the new database
\c postgres

-- Create the database
CREATE DATABASE crm_system;

-- Connect to the new database
\c crm_system

-- Enable UUID extension
SELECT 'Enabling UUID extension...' AS status;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify the extension is enabled
SELECT 'Verifying UUID extension...' AS status;
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'uuid-ossp';

SELECT 'Database setup complete!' AS status;

