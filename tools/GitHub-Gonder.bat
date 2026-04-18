@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

set "PROJECT_DIR=%~dp0.."
for %%I in ("%PROJECT_DIR%\.") do set "PROJECT_DIR=%%~fI"
if not "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR%\"

set "LOG_DIR=%PROJECT_DIR%\logs"
set "LOG_FILE=%LOG_DIR%\github-gonder.log"
set "DEFAULT_BRANCH=main"
set "BRANCH=%DEFAULT_BRANCH%"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

title GitHub Gonder
color 07

echo.
echo GitHub gonderimi basliyor...
echo ==== %date% %time% GitHub Gonder Basladi ====>> "%LOG_FILE%"
echo Proje klasoru: %PROJECT_DIR%>> "%LOG_FILE%"

where git >nul 2>&1
if errorlevel 1 (
  echo [HATA] Git bu bilgisayarda bulunamadi. Git'i kurup tekrar deneyin.
  echo [HATA] Git komutu bulunamadi.>> "%LOG_FILE%"
  pause
  exit /b 1
)

if not exist "%PROJECT_DIR%\.git\HEAD" (
  echo [HATA] .git klasoru eksik veya bozuk. Once GitHub-Depo-Kur.bat dosyasini calistirin.
  echo [HATA] Gecerli bir .git\HEAD bulunamadi.>> "%LOG_FILE%"
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

git rev-parse --is-inside-work-tree >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  popd
  echo [HATA] Bu klasor gecerli bir Git deposu degil. Once GitHub-Depo-Kur.bat dosyasini calistirin.
  pause
  exit /b 1
)

for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set "BRANCH=%%B"
if not defined BRANCH set "BRANCH=%DEFAULT_BRANCH%"

for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set "REMOTE_URL=%%R"
if not defined REMOTE_URL (
  popd
  echo [HATA] origin uzak deposu tanimli degil. Once remote ekleyin.
  echo [HATA] origin remote bulunamadi.>> "%LOG_FILE%"
  pause
  exit /b 1
)

echo Uzak depo: %REMOTE_URL%
echo Branch: %BRANCH%
echo.

if exist ".git\index.lock" del /f /q ".git\index.lock" >nul 2>&1
if exist ".git_eski" (
  echo [BILGI] Eski .git klasoru bulundu. Gonderime dahil edilmeyecek.
)

set "GIT_USER_NAME="
set "GIT_USER_EMAIL="
for /f "delims=" %%N in ('git config --get user.name 2^>nul') do set "GIT_USER_NAME=%%N"
for /f "delims=" %%E in ('git config --get user.email 2^>nul') do set "GIT_USER_EMAIL=%%E"
if not defined GIT_USER_NAME (
  set /p "GIT_USER_NAME=Git kullanici adiniz: "
  if not defined GIT_USER_NAME (
    popd
    echo [HATA] Git kullanici adi bos birakilamaz.
    pause
    exit /b 1
  )
  git config user.name "%GIT_USER_NAME%" >> "%LOG_FILE%" 2>&1
)
if not defined GIT_USER_EMAIL (
  set /p "GIT_USER_EMAIL=Git e-posta adresiniz: "
  if not defined GIT_USER_EMAIL (
    popd
    echo [HATA] Git e-posta adresi bos birakilamaz.
    pause
    exit /b 1
  )
  git config user.email "%GIT_USER_EMAIL%" >> "%LOG_FILE%" 2>&1
)
for /f "tokens=* delims= " %%N in ("%GIT_USER_NAME%") do set "GIT_USER_NAME=%%N"
for /f "tokens=* delims= " %%E in ("%GIT_USER_EMAIL%") do set "GIT_USER_EMAIL=%%E"
if "%GIT_USER_NAME%"=="" (
  popd
  echo [HATA] Git kullanici adi bos olamaz. GitHub-Gonder.bat dosyasini tekrar calistirin.
  pause
  exit /b 1
)
if "%GIT_USER_EMAIL%"=="" (
  popd
  echo [HATA] Git e-posta adresi bos olamaz. GitHub-Gonder.bat dosyasini tekrar calistirin.
  pause
  exit /b 1
)
git config user.name "%GIT_USER_NAME%" >> "%LOG_FILE%" 2>&1
git config user.email "%GIT_USER_EMAIL%" >> "%LOG_FILE%" 2>&1

git status
git status >> "%LOG_FILE%" 2>&1

set /p "COMMIT_MSG=Commit mesaji girin (bos birakirsan otomatik olusturulur): "
if not defined COMMIT_MSG (
  for /f "delims=" %%T in ('powershell -NoProfile -Command "Get-Date -Format ''yyyy-MM-dd HH:mm:ss''"') do set "COMMIT_MSG=Guncelleme %%T"
)

git add -A >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  popd
  echo [HATA] git add basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

if exist ".git_eski" (
  git reset -- ".git_eski" >nul 2>&1
)
if exist "tmp_excel_inspect" (
  git reset -- "tmp_excel_inspect" >nul 2>&1
)
if exist "tools\GitHub-Gonder.rar" (
  git reset -- "tools\GitHub-Gonder.rar" >nul 2>&1
)

git diff --cached --quiet
if errorlevel 1 (
  echo Commit olusturuluyor: %COMMIT_MSG%
  git commit -m "%COMMIT_MSG%" >> "%LOG_FILE%" 2>&1
  if errorlevel 1 (
    popd
    echo [HATA] git commit basarisiz. Ayrinti: %LOG_FILE%
    pause
    exit /b 1
  )
) else (
  echo Yeni commit gerektiren degisiklik yok.
  echo [BILGI] Yeni commit gerektiren degisiklik yok.>> "%LOG_FILE%"
)

echo.
echo Uzak depodaki son degisiklikler aliniyor...
git pull --rebase origin "%BRANCH%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  popd
  echo [HATA] git pull --rebase basarisiz. Muhtemel cakisma var. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

echo GitHub'a push yapiliyor... [%BRANCH%]
git push origin "%BRANCH%" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  popd
  echo [HATA] git push basarisiz. Ayrinti: %LOG_FILE%
  pause
  exit /b 1
)

popd
color 0A
echo.
echo Islem basariyla tamamlandi.
echo Branch: %BRANCH%
echo Remote: %REMOTE_URL%
echo [OK] GitHub'a gonderim tamamlandi. Branch: %BRANCH%>> "%LOG_FILE%"
echo ==== %date% %time% GitHub Gonder Tamamlandi ====>> "%LOG_FILE%"
pause
endlocal
