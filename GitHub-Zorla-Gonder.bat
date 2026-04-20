@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

set "PROJECT_DIR=%~dp0"
for %%I in ("%PROJECT_DIR%.") do set "PROJECT_DIR=%%~fI"
if not "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR%\"

set "LOG_DIR=%PROJECT_DIR%logs"
set "LOG_FILE=%LOG_DIR%\github-gonder.log"
set "DEFAULT_BRANCH=main"
set "BRANCH=%DEFAULT_BRANCH%"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

title GitHub Zorla Gonder
color 0C

echo.
echo UYARI: Bu islem GitHub'daki mevcut "%DEFAULT_BRANCH%" brancini yerel projeyle degistirecek.
set /p "CONFIRM=Devam etmek icin EVET yazin: "
if /I not "%CONFIRM%"=="EVET" (
  echo Islem iptal edildi.
  pause
  exit /b 0
)

echo ==== %date% %time% GitHub Zorla Gonder Basladi ====>> "%LOG_FILE%"
echo Proje klasoru: %PROJECT_DIR%>> "%LOG_FILE%"

where git >nul 2>&1
if errorlevel 1 (
  echo [HATA] Git bu bilgisayarda bulunamadi. Git'i kurup tekrar deneyin.
  echo [HATA] Git komutu bulunamadi.>> "%LOG_FILE%"
  pause
  exit /b 1
)

pushd "%PROJECT_DIR%" >nul 2>&1
if errorlevel 1 (
  echo [HATA] Proje klasorune gecilemedi. Ayrinti: %LOG_FILE%
  echo [HATA] pushd basarisiz.>> "%LOG_FILE%"
  pause
  exit /b 1
)

for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set "BRANCH=%%B"
if not defined BRANCH set "BRANCH=%DEFAULT_BRANCH%"

git status --short
git status --short >> "%LOG_FILE%" 2>&1

echo GitHub'a zorla push yapiliyor... [%BRANCH%]
git push --force-with-lease origin "%BRANCH%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  popd
  echo [HATA] Zorla push basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

popd
color 0A
echo.
echo GitHub'daki "%BRANCH%" branci yerel proje ile guncellendi.
echo [OK] GitHub zorla gonderim tamamlandi. Branch: %BRANCH%>> "%LOG_FILE%"
echo ==== %date% %time% GitHub Zorla Gonder Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
