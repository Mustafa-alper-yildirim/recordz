@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

set "PROJECT_DIR=%~dp0"
for %%I in ("%PROJECT_DIR%.") do set "PROJECT_DIR=%%~fI"
if not "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR%\"

set "REMOTE_URL=https://github.com/Mustafa-alper-yildirim/recordz.git"
set "DEFAULT_BRANCH=main"
set "LOG_DIR=%PROJECT_DIR%logs"
set "LOG_FILE=%LOG_DIR%\github-gonder.log"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

title GitHub Depo Kur
color 0E

echo.
echo GitHub depo baglantisi hazirlaniyor...
echo ==== %date% %time% GitHub Depo Kur Basladi ====>> "%LOG_FILE%"
echo Proje klasoru: %PROJECT_DIR%>> "%LOG_FILE%"
echo Remote: %REMOTE_URL%>> "%LOG_FILE%"

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

if exist ".git" (
  if not exist ".git\HEAD" (
    echo Eski veya bozuk .git klasoru bulundu. Guvenlik icin .git_eski olarak yeniden adlandiriliyor...
    attrib -h -s ".git" >nul 2>&1
    if exist ".git\config.lock" del /f /q ".git\config.lock" >nul 2>&1
    if exist ".git_eski" (
      attrib -h -s ".git_eski" >nul 2>&1
      rmdir /s /q ".git_eski" >> "%LOG_FILE%" 2>&1
    )
    ren ".git" ".git_eski" >> "%LOG_FILE%" 2>&1
    if exist ".git" (
      echo Bozuk .git klasoru yeniden adlandirilamadi, silinip yeniden olusturulacak.
      attrib -h -s ".git" >nul 2>&1
      rmdir /s /q ".git" >> "%LOG_FILE%" 2>&1
    )
  )
)

git init >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  popd
  echo [HATA] git init basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

git branch -M %DEFAULT_BRANCH% >> "%LOG_FILE%" 2>&1
git remote remove origin >> "%LOG_FILE%" 2>&1
git remote add origin "%REMOTE_URL%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  popd
  echo [HATA] origin remote eklenemedi. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set "FOUND_REMOTE=%%R"
if /I not "%FOUND_REMOTE%"=="%REMOTE_URL%" (
  popd
  echo [HATA] Remote dogrulanamadi. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

popd
color 0A
echo.
echo Git deposu hazirlandi.
echo Uzak depo: %REMOTE_URL%
echo Sonraki adim: GitHub-Gonder.bat dosyasini calistirin.
echo ==== %date% %time% GitHub Depo Kur Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
