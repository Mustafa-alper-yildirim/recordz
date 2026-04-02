@echo off
setlocal
title Silva Ev Kurulum

set "BASE_DIR=%~dp0"
set "ROOT_DIR=%BASE_DIR%.."
set "REPO_URL=https://github.com/Mustafa-alper-yildirim/recordz.git"
set "PROJECT_NAME=recordz"
set "TARGET_ROOT=%USERPROFILE%\Desktop\Silva-Projeler"
set "PROJECT_DIR=%TARGET_ROOT%\%PROJECT_NAME%"
set "LOG_DIR=%TARGET_ROOT%\logs"
set "LOG_FILE=%LOG_DIR%\ev-kurulum.log"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"

echo.
echo Silva Ahsap ev kurulumu basliyor...
echo.

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
echo ==== %date% %time% Ev Kurulum Basladi ====>> "%LOG_FILE%"

where git >nul 2>nul
if errorlevel 1 (
  echo [HATA] Git kurulu degil.
  echo Once Git kurun: https://git-scm.com/download/win
  echo [HATA] Git kurulu degil.>> "%LOG_FILE%"
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [HATA] Node.js kurulu degil.
  echo Once Node.js 22 LTS kurun: https://nodejs.org/
  echo [HATA] Node.js kurulu degil.>> "%LOG_FILE%"
  pause
  exit /b 1
)

echo [1/6] Hedef klasor hazirlaniyor...
if not exist "%TARGET_ROOT%" mkdir "%TARGET_ROOT%"
echo [OK] Hedef klasor hazirlandi.>> "%LOG_FILE%"

echo [2/6] Proje kontrol ediliyor...
if not exist "%PROJECT_DIR%\.git" (
  echo Proje indiriliyor...
  git clone "%REPO_URL%" "%PROJECT_DIR%" >> "%LOG_FILE%" 2>&1
) else (
  echo Proje zaten var, guncelleniyor...
  cd /d "%PROJECT_DIR%"
  git pull >> "%LOG_FILE%" 2>&1
)
if errorlevel 1 (
  echo [HATA] Git clone/pull islemi basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

echo [3/6] Backend .env hazirlaniyor...
cd /d "%PROJECT_DIR%\server\backend"
if not exist ".env" (
  copy /Y ".env.example" ".env" >nul
)
echo [OK] .env hazir.>> "%LOG_FILE%"

echo [4/6] NPM paketleri kuruluyor...
npm.cmd install >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] npm install basarisiz oldu. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

echo [5/6] Veritabani olusturuluyor...
npm.cmd run db:init >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] Veritabani kurulumu basarisiz oldu. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

echo [6/6] Kisayol .bat dosyalari olusturuluyor...
(
echo @echo off
echo set "PROJECT_DIR=%PROJECT_DIR%"
echo set "LOG_DIR=%LOG_DIR%"
echo if not exist "%%LOG_DIR%%" mkdir "%%LOG_DIR%%"
echo start "Silva Backend" cmd /k "pushd ""%%PROJECT_DIR%%\server\backend"" ^&^& npm.cmd run dev ^>^> ""%%LOG_DIR%%\backend.log"" 2^>^&1"
) > "%TARGET_ROOT%\Silva-Backend-Baslat.bat"

(
echo @echo off
echo taskkill /FI "WINDOWTITLE eq Silva Backend" /T /F
echo pause
) > "%TARGET_ROOT%\Silva-Backend-Durdur.bat"

(
echo @echo off
echo start "" "%PROJECT_DIR%\index.html"
) > "%TARGET_ROOT%\Silva-Panel-Ac.bat"

(
echo @echo off
echo set "PROJECT_DIR=%PROJECT_DIR%"
echo set "LOG_DIR=%LOG_DIR%"
echo if not exist "%%LOG_DIR%%" mkdir "%%LOG_DIR%%"
echo start "Silva Backend" cmd /k "pushd ""%%PROJECT_DIR%%\server\backend"" ^&^& npm.cmd run dev ^>^> ""%%LOG_DIR%%\backend.log"" 2^>^&1"
echo timeout /t 5 /nobreak ^>nul
echo powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest 'http://localhost:4000/api/health' -UseBasicParsing -TimeoutSec 5; exit 0 } catch { exit 1 }"
echo if errorlevel 1 (
echo   echo Backend baslatilamadi. Log dosyasini kontrol edin: %%LOG_DIR%%\backend.log
echo   pause
echo   exit /b 1
echo ^)
echo start "" "%PROJECT_DIR%\index.html"
) > "%TARGET_ROOT%\Silva-Tumunu-Baslat.bat"

copy /Y "%TARGET_ROOT%\Silva-Backend-Baslat.bat" "%DESKTOP_DIR%\Silva-Backend-Baslat.bat" >nul
copy /Y "%TARGET_ROOT%\Silva-Backend-Durdur.bat" "%DESKTOP_DIR%\Silva-Backend-Durdur.bat" >nul
copy /Y "%TARGET_ROOT%\Silva-Panel-Ac.bat" "%DESKTOP_DIR%\Silva-Panel-Ac.bat" >nul
copy /Y "%TARGET_ROOT%\Silva-Tumunu-Baslat.bat" "%DESKTOP_DIR%\Silva-Tumunu-Baslat.bat" >nul
copy /Y "%BASE_DIR%Silva-Otomatik-Baslat.vbs" "%DESKTOP_DIR%\Silva-Otomatik-Baslat.vbs" >nul
copy /Y "%BASE_DIR%Windows-Acilista-Kur.bat" "%DESKTOP_DIR%\Windows-Acilista-Kur.bat" >nul
copy /Y "%BASE_DIR%Windows-Acilista-Kaldir.bat" "%DESKTOP_DIR%\Windows-Acilista-Kaldir.bat" >nul
copy /Y "%BASE_DIR%Silva-Guncelle-Ve-Ac.bat" "%DESKTOP_DIR%\Silva-Guncelle-Ve-Ac.bat" >nul
echo [OK] Masaustu baslaticilari olusturuldu.>> "%LOG_FILE%"

echo.
echo Kurulum tamamlandi.
echo Proje klasoru: %PROJECT_DIR%
echo Baslaticilar: %TARGET_ROOT%
echo Log dosyasi: %LOG_FILE%
echo.
echo Masaustunde olusan dosya:
echo %DESKTOP_DIR%\Silva-Tumunu-Baslat.bat
echo.
echo ==== %date% %time% Ev Kurulum Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
