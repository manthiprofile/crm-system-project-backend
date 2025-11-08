# PostgreSQL Database Setup Script for Windows
# This script sets up the PostgreSQL database for the CRM system

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

# Default values from environment or defaults
$DB_HOST = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$DB_PORT = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$DB_USERNAME = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { "postgres" }
$DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "postgres" }
$DB_NAME = if ($env:DB_DATABASE) { $env:DB_DATABASE } else { "crm_system" }

Write-Success "PostgreSQL Database Setup"
Write-Host "================================"
Write-Host ""

# Check if PostgreSQL is installed
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Error "Error: PostgreSQL (psql) is not installed or not in PATH"
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/"
    Write-Host "Make sure to add PostgreSQL bin directory to your PATH"
    exit 1
}

Write-Success "[OK] PostgreSQL is installed"

# Check if PostgreSQL is running
$pgIsReady = Get-Command pg_isready -ErrorAction SilentlyContinue
if ($pgIsReady) {
    $pgCheckResult = & pg_isready -h $DB_HOST -p $DB_PORT 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Warning: PostgreSQL server is not running on ${DB_HOST}:${DB_PORT}"
        Write-Host "Please start PostgreSQL service from Services (services.msc)"
        exit 1
    }
    Write-Success "[OK] PostgreSQL server is running"
} else {
    # If pg_isready is not available, skip the check
    Write-Host "Checking PostgreSQL connection..."
    Write-Warning "Warning: pg_isready not found, skipping connection check"
    Write-Host "Continuing with database setup..."
}

# Set PGPASSWORD environment variable for non-interactive password
$env:PGPASSWORD = $DB_PASSWORD

# Create database if it doesn't exist
Write-Host ""
Write-Host "Creating database '$DB_NAME'..."
$dbExists = & psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" 2>&1

if ($dbExists -match "1") {
    Write-Warning "Database '$DB_NAME' already exists"
} else {
    & psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -c "CREATE DATABASE $DB_NAME" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "[OK] Database '$DB_NAME' created"
    } else {
        Write-Error "Failed to create database"
        $env:PGPASSWORD = $null
        exit 1
    }
}

# Enable UUID extension
Write-Host ""
Write-Host "Enabling UUID extension..."
& psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS `"uuid-ossp`"" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Success "[OK] UUID extension enabled"
} else {
    Write-Error "Failed to enable UUID extension"
    $env:PGPASSWORD = $null
    exit 1
}

# Verify setup
Write-Host ""
Write-Host "Verifying setup..."
$extensionCheck = & psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -tAc "SELECT extname FROM pg_extension WHERE extname = 'uuid-ossp'" 2>&1

if ($extensionCheck -match "uuid-ossp") {
    Write-Success "[OK] UUID extension is active"
} else {
    Write-Error "[FAIL] UUID extension verification failed"
    $env:PGPASSWORD = $null
    exit 1
}

Write-Host ""
Write-Success "================================"
Write-Success "Database setup completed successfully!"
Write-Success "================================"
Write-Host ""
Write-Host "Database: $DB_NAME"
Write-Host "Host: ${DB_HOST}:${DB_PORT}"
Write-Host "Next step: Run npm run migration:run to create tables"

# Unset password
$env:PGPASSWORD = $null

