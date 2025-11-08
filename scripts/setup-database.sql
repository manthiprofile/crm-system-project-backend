-- PostgreSQL Database Setup Script
-- This script creates the database and enables required extensions
-- Safe to run multiple times (idempotent)

-- Create database if it doesn't exist
-- Note: PostgreSQL doesn't support IF NOT EXISTS for CREATE DATABASE
-- So we'll use a DO block to check first
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'crm_system') THEN
        CREATE DATABASE crm_system;
        RAISE NOTICE 'Database crm_system created successfully';
    ELSE
        RAISE NOTICE 'Database crm_system already exists';
    END IF;
END
$$;

-- Connect to the new database
\c crm_system

-- Enable UUID extension (required for UUID generation in migrations)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extension is enabled
SELECT extname, extversion FROM pg_extension WHERE extname = 'uuid-ossp';

-- Display success message
\echo 'Database setup completed successfully!'
\echo 'Database: crm_system'
\echo 'UUID extension: enabled'

