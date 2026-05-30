@echo off
echo ============================================
echo   English Learning Platform - Iniciando...
echo ============================================
echo.
echo [1/2] Iniciando Backend (porta 5000)...
start "Backend - English Learning" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo [2/2] Aguardando backend e iniciando Frontend (porta 5173)...
timeout /t 3 /nobreak > nul
start "Frontend - English Learning" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ============================================
echo   Aplicacao iniciada!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ============================================
echo.
pause
