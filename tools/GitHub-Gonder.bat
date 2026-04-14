@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "PROJECT_DIR=%~dp0.."
set "LOG_DIR=%PROJECT_DIR%\logs"
set "LOG_FILE=%LOG_DIR%\github-gonder.log"
set "BRANCH=main"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
cd /d "%PROJECT_DIR%"

echo GitHub gonderimi basliyor...
echo ==== %date% %time% GitHub Gonder Basladi ====>> "%LOG_FILE%"

git rev-parse --is-inside-work-tree >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] Bu klasor bir Git deposu degil. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set "BRANCH=%%B"
if not defined BRANCH set "BRANCH=main"

git status
git status >> "%LOG_FILE%" 2>&1

git add -A >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] git add basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

git diff --cached --quiet
if errorlevel 1 (
  set "TIMESTAMP="
  for /f "delims=" %%T in ('powershell -NoProfile -Command "Get-Date -Format ''yyyy-MM-dd HH:mm:ss''"') do set "TIMESTAMP=%%T"
  if not defined TIMESTAMP set "TIMESTAMP=%date% %time%"
  set "COMMIT_MSG=Otomatik guncelleme !TIMESTAMP!"

  echo Commit olusturuluyor: !COMMIT_MSG!
  git commit -m "!COMMIT_MSG!" >> "%LOG_FILE%" 2>&1
  if errorlevel 1 (
    echo [HATA] git commit basarisiz. Ayrinti: %LOG_FILE%
    pause
    exit /b 1
  )
) else (
  echo Yeni commit gerektiren degisiklik yok.
)

echo Uzak depodaki son degisiklikler aliniyor...
git pull --rebase origin "%BRANCH%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] git pull --rebase basarisiz. Muhtemel cakisma var. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

echo GitHub'a push yapiliyor... [%BRANCH%]
git push origin "%BRANCH%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo [HATA] git push basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

color 0A
echo Islem basariyla tamamlandi. Branch: %BRANCH%
echo [OK] GitHub'a gonderim tamamlandi. Branch: %BRANCH%>> "%LOG_FILE%"
echo ==== %date% %time% GitHub Gonder Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
