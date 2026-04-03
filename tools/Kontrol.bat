@echo off
setlocal
set "PROJECT_DIR=%~dp0.."

cd /d "%PROJECT_DIR%"

echo.
echo === Silva Proje Kontrol ===
echo.

set /p FILE_NAME=Kontrol etmek istediginiz dosya adini veya yolunu yazin: 

echo.
echo [1] Dosya klasorde var mi?
if exist "%FILE_NAME%" (
  echo EVET - Dosya bulundu: %FILE_NAME%
) else (
  echo HAYIR - Dosya bulunamadi: %FILE_NAME%
)

echo.
echo [2] Git bu dosyayi goruyor mu?
git status -- "%FILE_NAME%"

echo.
echo [3] .gitignore nedeniyle engelleniyor mu?
git check-ignore -v "%FILE_NAME%"
if errorlevel 1 (
  echo Bu dosya .gitignore tarafindan engellenmiyor gibi gorunuyor.
)

echo.
echo [4] Genel Git durumu
git status

echo.
echo [5] GitHub remote bilgisi
git remote -v

echo.
echo [6] Aktif branch
git branch --show-current

echo.
echo [7] Son gonderilen commit
git log -1 --oneline

echo.
echo Aciklama:
echo - Dosya git status icinde gorunuyorsa Git dosyayi gormustur.
echo - git check-ignore sonuc veriyorsa dosya .gitignore nedeniyle Git'e dahil edilmiyordur.
echo - "nothing to commit, working tree clean" ise yerel durum temizdir.
echo - Push sonrasi GitHub sitesinde de dosyayi gorebilirsiniz.
echo.
pause
endlocal
