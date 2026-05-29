@echo off
title Prime Interest — Dev Server
cd /d "%~dp0"
echo Starting Prime Interest website...
echo.
echo When you see "Ready", open your browser to:
echo http://localhost:3000
echo.
echo Keep this window open while browsing.
echo Close it when you're done.
echo.
npm run dev
pause
