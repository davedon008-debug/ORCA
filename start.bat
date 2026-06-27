@echo off
title Orca Dev Servers
echo ========================================
echo   Starting ORCA Development Servers...
echo ========================================
echo.

echo [1/2] Starting Backend on port 5001...
start "ORCA Backend" cmd /k "cd /d C:\Users\Administrator\OneDrive\Documents\antigravity\backend && echo Backend starting... && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend on port 3000...
start "ORCA Frontend" cmd /k "cd /d C:\Users\Administrator\OneDrive\Documents\antigravity\frontend && echo Frontend starting... && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   Both servers are running!
echo   Open: http://localhost:3000
echo ========================================
echo.

start "" "http://localhost:3000"
