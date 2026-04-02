@echo off
setlocal
set "BASE_DIR=%~dp0"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

copy /Y "%BASE_DIR%Silva-Otomatik-Baslat.vbs" "%STARTUP_DIR%\Silva-Otomatik-Baslat.vbs" >nul

echo Windows acilisinda backend otomatik baslayacak sekilde ayarlandi.
echo Baslangic klasorune kopyalandi:
echo %STARTUP_DIR%\Silva-Otomatik-Baslat.vbs
pause
endlocal
