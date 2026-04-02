@echo off
setlocal
set "STARTUP_FILE=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Silva-Otomatik-Baslat.vbs"

if exist "%STARTUP_FILE%" (
  del /F /Q "%STARTUP_FILE%"
  echo Windows acilis otomasyonu kaldirildi.
) else (
  echo Baslangic dosyasi bulunamadi.
)

pause
endlocal
