@echo off
REM QuickGPT - Quick Start Script (Windows)
REM Run both frontend and backend servers

echo.
echo ╔════════════════════════════════════╗
echo ║     QuickGPT - Starting Servers    ║
echo ╚════════════════════════════════════╝
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm is not installed. Please install Node.js and npm first.
    pause
    exit /b 1
)

echo [Backend] Starting Backend Server...
echo Backend will run on http://localhost:3000
echo.

REM Start backend in a new window
start cmd /k "cd /d %cd%\server && npm run server"

REM Give backend a moment to start
timeout /t 3 /nobreak

echo [Frontend] Starting Frontend Server...
echo Frontend will run on http://localhost:5173
echo.

REM Start frontend in a new window
start cmd /k "cd /d %cd%\client && npm run dev"

echo.
echo [Status] Both servers are starting...
echo [Info] Backend: http://localhost:3000
echo [Info] Frontend: http://localhost:5173
echo.
pause
