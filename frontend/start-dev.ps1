# PowerShell script to start the development server
# This script helps bypass execution policy issues

Write-Host "Starting New Gate Chapel Website Development Server..." -ForegroundColor Green
Write-Host "Make sure you have Node.js installed and dependencies are installed." -ForegroundColor Yellow
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    & npm install
}

# Start the development server
Write-Host "Starting Vite development server..." -ForegroundColor Green
& npx vite

Write-Host "Development server should be running at http://localhost:5173" -ForegroundColor Green
