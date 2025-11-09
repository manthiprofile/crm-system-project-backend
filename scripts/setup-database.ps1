# PowerShell script to set up PostgreSQL database for CRM System
# This script creates the database

$ErrorActionPreference = "Continue"

# Function to load environment variables from .env file
function Load-EnvFile {
    param([string]$FilePath = ".env")
    
    if (Test-Path $FilePath) {
        Write-Host "Loading environment variables from $FilePath..." -ForegroundColor Cyan
        Get-Content $FilePath | ForEach-Object {
            if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                # Remove quotes if present
                $value = $value -replace '^["'']|["'']$', ''
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
            }
        }
    } else {
        Write-Host "Warning: .env file not found. Using default values." -ForegroundColor Yellow
    }
}

# Load environment variables
Load-EnvFile

# Get database configuration from environment variables or use defaults
$dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$dbUsername = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { "postgres" }
$dbPassword = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "postgres" }
$dbName = if ($env:DB_DATABASE) { $env:DB_DATABASE } else { "crm_system" }

# Set PGPASSWORD environment variable for psql
$env:PGPASSWORD = $dbPassword

Write-Host "`n=== PostgreSQL Database Setup ===" -ForegroundColor Green
Write-Host "Host: $dbHost" -ForegroundColor Cyan
Write-Host "Port: $dbPort" -ForegroundColor Cyan
Write-Host "Username: $dbUsername" -ForegroundColor Cyan
Write-Host "Database: $dbName" -ForegroundColor Cyan
Write-Host ""

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "Error: psql command not found. Please ensure PostgreSQL is installed and in your PATH." -ForegroundColor Red
    exit 1
}

# Function to execute SQL command
function Invoke-PostgresCommand {
    param(
        [string]$Database,
        [string]$Command,
        [string]$Description
    )
    
    Write-Host "Executing: $Description..." -ForegroundColor Yellow
    
    $result = & psql -h $dbHost -p $dbPort -U $dbUsername -d $Database -c $Command 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success: $Description" -ForegroundColor Green
        return $true
    } else {
        # Filter out warnings and check for actual errors
        $errors = $result | Where-Object { 
            $_ -notmatch "WARNING" -and 
            $_ -notmatch "collation" -and 
            $_ -notmatch "version mismatch" -and
            $_ -match "ERROR|FATAL|error"
        }
        
        if ($errors) {
            Write-Host "Error: $Description" -ForegroundColor Red
            Write-Host $errors -ForegroundColor Red
            return $false
        } else {
            Write-Host "Success: $Description (warnings suppressed)" -ForegroundColor Green
            return $true
        }
    }
}

# Step 1: Check if database exists
Write-Host "Checking if database '$dbName' exists..." -ForegroundColor Cyan
$dbExists = & psql -h $dbHost -p $dbPort -U $dbUsername -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$dbName'" 2>&1 | Where-Object { $_ -notmatch "WARNING|collation" }

if ($dbExists -eq "1") {
    Write-Host "Database '$dbName' already exists." -ForegroundColor Yellow
} else {
    Write-Host "Creating database '$dbName'..." -ForegroundColor Cyan
    $createDbResult = Invoke-PostgresCommand -Database "postgres" -Command "CREATE DATABASE $dbName;" -Description "Create database '$dbName'"
    
    if (-not $createDbResult) {
        Write-Host "Failed to create database. Please check your PostgreSQL connection and permissions." -ForegroundColor Red
        exit 1
    }
}

# Step 2: Verify setup
Write-Host "`nVerifying database setup..." -ForegroundColor Cyan
$verifyResult = & psql -h $dbHost -p $dbPort -U $dbUsername -d $dbName -tAc "SELECT 1;" 2>&1 | Where-Object { $_ -notmatch "WARNING|collation" }

if ($verifyResult -eq "1") {
    Write-Host "`n=== Database Setup Complete ===" -ForegroundColor Green
    Write-Host "Database '$dbName' is ready to use." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Run migrations: npm run db:migrate" -ForegroundColor White
    Write-Host "2. Verify connection: npm run db:check" -ForegroundColor White
} else {
    Write-Host "`nError: Could not verify database connection." -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

