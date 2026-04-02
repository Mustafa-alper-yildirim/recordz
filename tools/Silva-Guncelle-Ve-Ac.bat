@echo off
setlocal
set "BASE_DIR=%~dp0"
set "PROJECT_DIR=%BASE_DIR%.."
set "LOG_DIR=%PROJECT_DIR%\logs"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo ==== %date% %time% Guncelle ve Ac Basladi ====>> "%LOG_DIR%\guncelle-ve-ac.log"

cd /d "%PROJECT_DIR%"
git pull >> "%LOG_DIR%\guncelle-ve-ac.log" 2>&1
if errorlevel 1 (
  echo [HATA] git pull basarisiz. Ayrinti: %LOG_DIR%\guncelle-ve-ac.log
  pause
  exit /b 1
)

call "%PROJECT_DIR%\Silva-Tumunu-Baslat.bat"

echo ==== %date% %time% Guncelle ve Ac Tamamlandi ====>> "%LOG_DIR%\guncelle-ve-ac.log"
endlocal
