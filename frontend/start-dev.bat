@echo off
echo Starting New Gate Chapel Website Development Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo Starting Vite development server...
npx vite

echo.
echo Development server should be running at http://localhost:5173
pause
