@echo off
title Prime Interest — Share
cd /d "%~dp0"

echo Starting website server...
start "Prime Interest Server" cmd /k "cd /d "%~dp0" && npm run dev"

echo Waiting for server to start...
timeout /t 18 /nobreak >nul

echo Starting share tunnel...
echo.
echo =========================================
echo  Your shareable link will appear below.
echo  Send it to anyone on any device.
echo  Keep BOTH windows open while sharing.
echo =========================================
echo.
cloudflared tunnel --url http://localhost:3000
