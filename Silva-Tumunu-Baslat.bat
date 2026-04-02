@echo off
set "BASE_DIR=%~dp0"
start "Silva Backend" cmd /k "pushd ""%BASE_DIR%server\backend"" && npm.cmd run dev"
timeout /t 3 /nobreak >nul
start "" "%BASE_DIR%index.html"
