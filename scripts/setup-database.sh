#!/bin/bash

# Bash script to set up PostgreSQL database for CRM System
# This script creates the database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to load environment variables from .env file
load_env_file() {
    local env_file="${1:-.env}"
    
    if [ -f "$env_file" ]; then
        echo -e "${CYAN}Loading environment variables from $env_file...${NC}"
        export $(grep -v '^#' "$env_file" | grep -v '^$' | xargs)
    else
        echo -e "${YELLOW}Warning: .env file not found. Using default values.${NC}"
    fi
}

# Load environment variables
load_env_file

# Get database configuration from environment variables or use defaults
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USERNAME="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_DATABASE="${DB_DATABASE:-crm_system}"

# Set PGPASSWORD environment variable for psql
export PGPASSWORD="$DB_PASSWORD"

echo -e "\n${GREEN}=== PostgreSQL Database Setup ===${NC}"
echo -e "${CYAN}Host: $DB_HOST${NC}"
echo -e "${CYAN}Port: $DB_PORT${NC}"
echo -e "${CYAN}Username: $DB_USERNAME${NC}"
echo -e "${CYAN}Database: $DB_DATABASE${NC}"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql command not found. Please ensure PostgreSQL is installed and in your PATH.${NC}"
    exit 1
fi

# Function to execute SQL command
execute_postgres_command() {
    local database=$1
    local command=$2
    local description=$3
    
    echo -e "${YELLOW}Executing: $description...${NC}"
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$database" -c "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}Success: $description${NC}"
        return 0
    else
        echo -e "${RED}Error: $description${NC}"
        return 1
    fi
}

# Step 1: Check if database exists
echo -e "${CYAN}Checking if database '$DB_DATABASE' exists...${NC}"
DB_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_DATABASE'" 2>/dev/null || echo "0")

if [ "$DB_EXISTS" = "1" ]; then
    echo -e "${YELLOW}Database '$DB_DATABASE' already exists.${NC}"
else
    echo -e "${CYAN}Creating database '$DB_DATABASE'...${NC}"
    if ! execute_postgres_command "postgres" "CREATE DATABASE $DB_DATABASE;" "Create database '$DB_DATABASE'"; then
        echo -e "${RED}Failed to create database. Please check your PostgreSQL connection and permissions.${NC}"
        exit 1
    fi
fi

# Step 2: Verify setup
echo -e "\n${CYAN}Verifying database setup...${NC}"
VERIFY_RESULT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" -tAc "SELECT 1;" 2>/dev/null || echo "0")

if [ "$VERIFY_RESULT" = "1" ]; then
    echo -e "\n${GREEN}=== Database Setup Complete ===${NC}"
    echo -e "${GREEN}Database '$DB_DATABASE' is ready to use.${NC}"
    echo -e "\n${CYAN}Next steps:${NC}"
    echo -e "1. Run migrations: ${NC}npm run db:migrate"
    echo -e "2. Verify connection: ${NC}npm run db:check"
else
    echo -e "\n${RED}Error: Could not verify database connection.${NC}"
    exit 1
fi

# Clean up
unset PGPASSWORD

