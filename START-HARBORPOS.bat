@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is not installed. Install Node.js 18+ first.& pause & exit /b 1)
if not exist node_modules\pg (call npm install)
start "HarborPOS Server" cmd /k "npm start"
timeout /t 2 >nul
start http://localhost:8787
