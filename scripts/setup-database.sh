#!/bin/bash

# PostgreSQL Database Setup Script for Linux/macOS
# This script sets up the PostgreSQL database for the CRM system

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USERNAME="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_NAME="${DB_DATABASE:-crm_system}"

echo -e "${GREEN}PostgreSQL Database Setup${NC}"
echo "================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: PostgreSQL (psql) is not installed or not in PATH${NC}"
    echo "Please install PostgreSQL:"
    echo "  macOS: brew install postgresql@15"
    echo "  Linux: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL is installed${NC}"

# Check if PostgreSQL is running
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" &> /dev/null; then
    echo -e "${YELLOW}Warning: PostgreSQL server is not running on $DB_HOST:$DB_PORT${NC}"
    echo "Please start PostgreSQL:"
    echo "  macOS: brew services start postgresql@15"
    echo "  Linux: sudo systemctl start postgresql"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL server is running${NC}"

# Set PGPASSWORD environment variable for non-interactive password
export PGPASSWORD="$DB_PASSWORD"

# Create database if it doesn't exist
echo ""
echo "Creating database '$DB_NAME'..."
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
    echo -e "${YELLOW}Database '$DB_NAME' already exists${NC}"
else
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d postgres -c "CREATE DATABASE $DB_NAME" > /dev/null
    echo -e "${GREEN}✓ Database '$DB_NAME' created${NC}"
fi

# Enable UUID extension
echo ""
echo "Enabling UUID extension..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"" > /dev/null
echo -e "${GREEN}✓ UUID extension enabled${NC}"

# Verify setup
echo ""
echo "Verifying setup..."
EXTENSION_CHECK=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -tc "SELECT extname FROM pg_extension WHERE extname = 'uuid-ossp'")

if [ -n "$EXTENSION_CHECK" ]; then
    echo -e "${GREEN}✓ UUID extension is active${NC}"
else
    echo -e "${RED}✗ UUID extension verification failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Database setup completed successfully!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Next step: Run 'npm run migration:run' to create tables"

# Unset password
unset PGPASSWORD

