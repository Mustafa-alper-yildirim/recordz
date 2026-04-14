@echo off
setlocal
set "PROJECT_DIR=%~dp0"
set "LOG_DIR=%PROJECT_DIR%\logs"
set "LOG_FILE=%LOG_DIR%\github-gonder.log"
set "STATUS_FILE=%TEMP%\silva_git_status_%RANDOM%.txt"
set "AHEAD_FILE=%TEMP%\silva_git_ahead_%RANDOM%.txt"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

cd /d "%PROJECT_DIR%"

echo GitHub'a gonderim basliyor...
echo ==== %date% %time% GitHub Gonder Basladi ====>> "%LOG_FILE%"
call :ensure_git_identity
if errorlevel 1 (
  echo [HATA] Git kullanici bilgileri ayarlanamadi. Ayrinti: %LOG_FILE%
  echo [HATA] Git kullanici bilgileri ayarlanamadi.>> "%LOG_FILE%"
  pause
  exit /b 1
)
git status >> "%LOG_FILE%" 2>&1
echo.

git status --porcelain > "%STATUS_FILE%" 2>> "%LOG_FILE%"
if errorlevel 1 (
  echo [HATA] git status calistirilamadi. Ayrinti: %LOG_FILE%
  echo [HATA] git status calistirilamadi.>> "%LOG_FILE%"
  if exist "%STATUS_FILE%" del "%STATUS_FILE%"
  if exist "%AHEAD_FILE%" del "%AHEAD_FILE%"
  pause
  exit /b 1
)

for %%A in ("%STATUS_FILE%") do set "STATUS_SIZE=%%~zA"
if not defined STATUS_SIZE set "STATUS_SIZE=0"
if %STATUS_SIZE% GTR 0 goto has_changes

git rev-list --left-right --count origin/main...main > "%AHEAD_FILE%" 2>> "%LOG_FILE%"
if not errorlevel 1 (
  set /p AHEAD_COUNTS=<"%AHEAD_FILE%"
  for /f "tokens=1,2" %%L in ("%AHEAD_COUNTS%") do (
    set "BEHIND_COUNT=%%L"
    set "AHEAD_COUNT=%%M"
  )
  if defined AHEAD_COUNT if not "%AHEAD_COUNT%"=="0" goto sync_and_push
)

echo Degisiklik yok. GitHub'a gonderilecek yeni bir sey bulunmadi.
echo [BILGI] Degisiklik yok.>> "%LOG_FILE%"
if exist "%STATUS_FILE%" del "%STATUS_FILE%"
if exist "%AHEAD_FILE%" del "%AHEAD_FILE%"
pause
exit /b 0

:has_changes
if exist "%STATUS_FILE%" del "%STATUS_FILE%"
if exist "%AHEAD_FILE%" del "%AHEAD_FILE%"
git add .
if errorlevel 1 (
  echo [HATA] git add basarisiz. Ayrinti: %LOG_FILE%
  echo [HATA] git add basarisiz.>> "%LOG_FILE%"
  pause
  exit /b 1
)

set /p COMMIT_MSG=Commit mesajini yazin: 
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Son degisiklikler gonderildi"

git commit -m "%COMMIT_MSG%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] git commit basarisiz. Ayrinti: %LOG_FILE%
  echo [HATA] git commit basarisiz.>> "%LOG_FILE%"
  pause
  exit /b 1
)

:sync_and_push
echo Uzak depodaki son degisiklikler aliniyor...
git pull --rebase origin main >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] git pull --rebase basarisiz. Muhtemel cakisma var. Ayrinti: %LOG_FILE%
  echo [HATA] git pull --rebase basarisiz.>> "%LOG_FILE%"
  pause
  exit /b 1
)

git push >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] git push basarisiz. Ayrinti: %LOG_FILE%
  echo [HATA] git push basarisiz.>> "%LOG_FILE%"
  pause
  exit /b 1
)

echo.
color 0A
echo Islem basariyla tamamlandi.
echo [OK] GitHub'a gonderim tamamlandi.>> "%LOG_FILE%"
echo ==== %date% %time% GitHub Gonder Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
exit /b 0

:ensure_git_identity
git config --get user.name >nul 2>&1
if not errorlevel 1 goto check_email

set /p GIT_USER_NAME=Git kullanici adini yazin: 
if "%GIT_USER_NAME%"=="" exit /b 1
git config user.name "%GIT_USER_NAME%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 exit /b 1
echo [BILGI] Git user.name ayarlandi.>> "%LOG_FILE%"

:check_email
git config --get user.email >nul 2>&1
if not errorlevel 1 exit /b 0

set /p GIT_USER_EMAIL=Git e-posta adresini yazin: 
if "%GIT_USER_EMAIL%"=="" exit /b 1
git config user.email "%GIT_USER_EMAIL%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 exit /b 1
echo [BILGI] Git user.email ayarlandi.>> "%LOG_FILE%"
exit /b 0
