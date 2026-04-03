@echo off
setlocal
title Silva Tek Dosya Baslat

set "BASE_DIR=%~dp0"
set "REPO_URL=https://github.com/Mustafa-alper-yildirim/recordz.git"
set "PROJECT_NAME=recordz"
set "TARGET_ROOT=%USERPROFILE%\Desktop\Silva-Projeler"
set "PROJECT_DIR=%TARGET_ROOT%\%PROJECT_NAME%"
set "BACKEND_DIR=%PROJECT_DIR%\server\backend"
set "LOG_DIR=%TARGET_ROOT%\logs"
set "LOG_FILE=%LOG_DIR%\silva-tek-dosya.log"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "DESKTOP_LAUNCHER=%DESKTOP_DIR%\Silva-Tek-Dosya.bat"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
echo ==== %date% %time% Silva Tek Dosya Basladi ====>> "%LOG_FILE%"

echo.
echo Silva Ahsap tek dosya otomasyonu basliyor...
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [HATA] Git kurulu degil. Kurun: https://git-scm.com/download/win
  echo [HATA] Git kurulu degil.>> "%LOG_FILE%"
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [HATA] Node.js kurulu degil. Node 22 LTS kurun: https://nodejs.org/
  echo [HATA] Node.js kurulu degil.>> "%LOG_FILE%"
  pause
  exit /b 1
)

if not exist "%TARGET_ROOT%" mkdir "%TARGET_ROOT%"
if not exist "%DESKTOP_LAUNCHER%" (
  copy /Y "%~f0" "%DESKTOP_LAUNCHER%" >nul
)

if not exist "%PROJECT_DIR%\.git" (
  echo [1/5] Proje indiriliyor...
  git clone "%REPO_URL%" "%PROJECT_DIR%" >> "%LOG_FILE%" 2>&1
  if errorlevel 1 (
    echo [HATA] Proje indirilemedi. Ayrinti: %LOG_FILE%
    pause
    exit /b 1
  )
) else (
  echo [1/5] Proje guncelleniyor...
  cd /d "%PROJECT_DIR%"
  git pull >> "%LOG_FILE%" 2>&1
  if errorlevel 1 (
    echo [HATA] Proje guncellenemedi. Ayrinti: %LOG_FILE%
    pause
    exit /b 1
  )
)

echo [2/5] Backend ayarlaniyor...
cd /d "%BACKEND_DIR%"
if not exist ".env" (
  copy /Y ".env.example" ".env" >nul
)

echo [3/5] Paketler kontrol ediliyor...
if not exist "%BACKEND_DIR%\node_modules" (
  npm.cmd install >> "%LOG_FILE%" 2>&1
  if errorlevel 1 (
    echo [HATA] npm install basarisiz. Ayrinti: %LOG_FILE%
    pause
    exit /b 1
  )
)

echo [4/5] Veritabani hazirlaniyor...
if not exist "%BACKEND_DIR%\data" mkdir "%BACKEND_DIR%\data"
if not exist "%BACKEND_DIR%\data\silva-ahsap.sqlite" (
  npm.cmd run db:init >> "%LOG_FILE%" 2>&1
  if errorlevel 1 (
    echo [HATA] db:init basarisiz. Ayrinti: %LOG_FILE%
    pause
    exit /b 1
  )
)

echo [5/5] Backend kontrol ediliyor...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest 'http://localhost:4000/api/health' -UseBasicParsing -TimeoutSec 3; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  echo Backend kapali, baslatiliyor...
  start "Silva Backend" cmd /k "pushd ""%BACKEND_DIR%"" && npm.cmd run dev >> ""%LOG_DIR%\backend.log"" 2>&1"
  timeout /t 5 /nobreak >nul
) else (
  echo Backend zaten calisiyor.
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest 'http://localhost:4000/api/health' -UseBasicParsing -TimeoutSec 5; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  echo [HATA] Backend acilamadi. Ayrinti: %LOG_DIR%\backend.log
  echo [HATA] Backend acilamadi.>> "%LOG_FILE%"
  pause
  exit /b 1
)

start "" "%PROJECT_DIR%\index.html"

echo.
color 0A
echo Program basariyla acildi.
echo Proje klasoru: %PROJECT_DIR%
echo Log dosyasi: %LOG_FILE%
echo Masaustu baslatici: %DESKTOP_LAUNCHER%
echo ==== %date% %time% Silva Tek Dosya Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
