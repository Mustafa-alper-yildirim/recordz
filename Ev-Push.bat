@echo off
setlocal
set "PROJECT_DIR=%USERPROFILE%\Desktop\Silva-Projeler\recordz"
set "LOG_DIR=%USERPROFILE%\Desktop\Silva-Projeler\logs"
set "LOG_FILE=%LOG_DIR%\ev-push.log"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
echo ==== %date% %time% Ev Push Basladi ====>> "%LOG_FILE%"

if not exist "%PROJECT_DIR%\.git" (
  echo [HATA] Proje bulunamadi: %PROJECT_DIR%
  echo [HATA] Proje bulunamadi.>> "%LOG_FILE%"
  pause
  exit /b 1
)

cd /d "%PROJECT_DIR%"
git add . >> "%LOG_FILE%" 2>&1
set /p COMMIT_MSG=Commit mesajini yazin: 
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Evde yapilan degisiklikler"
git commit -m "%COMMIT_MSG%" >> "%LOG_FILE%" 2>&1
git push >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] Push islemi basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)
echo ==== %date% %time% Ev Push Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
