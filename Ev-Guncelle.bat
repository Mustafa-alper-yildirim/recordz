@echo off
setlocal
set "PROJECT_DIR=%USERPROFILE%\Desktop\Silva-Projeler\recordz"
set "LOG_DIR=%USERPROFILE%\Desktop\Silva-Projeler\logs"
set "LOG_FILE=%LOG_DIR%\ev-guncelle.log"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
echo ==== %date% %time% Ev Guncelle Basladi ====>> "%LOG_FILE%"

if not exist "%PROJECT_DIR%\.git" (
  echo [HATA] Proje bulunamadi: %PROJECT_DIR%
  echo [HATA] Proje bulunamadi.>> "%LOG_FILE%"
  pause
  exit /b 1
)

cd /d "%PROJECT_DIR%"
git pull >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] Guncelleme basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)
echo ==== %date% %time% Ev Guncelle Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
