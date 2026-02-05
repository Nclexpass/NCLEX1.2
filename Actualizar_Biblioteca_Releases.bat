@echo off
setlocal enabledelayedexpansion

REM ===========================================
REM NCLEX Library Updater (GitHub Releases mode)
REM - Generates library\catalog.json (fileUrl -> GitHub Releases)
REM - Deploys app + covers + catalog to Firebase Hosting
REM ===========================================

set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo.
echo ===========================================
echo   NCLEX Library Updater (Releases)
echo   Project: %PROJECT_DIR%
echo ===========================================
echo.

if not exist "%PROJECT_DIR%\firebase.json" (
  echo ERROR: No encuentro firebase.json en:
  echo   %PROJECT_DIR%
  pause
  exit /b 1
)

if not exist "%PROJECT_DIR%\library\make_catalog.ps1" (
  echo ERROR: No encuentro library\make_catalog.ps1
  pause
  exit /b 1
)

echo [1/2] Generando catalogo (GitHub Releases)...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PROJECT_DIR%\library\make_catalog.ps1"
if errorlevel 1 (
  echo.
  echo ERROR: Fallo generando el catalogo.
  pause
  exit /b 1
)

echo.
echo [2/2] Publicando a Firebase Hosting...
cd /d "%PROJECT_DIR%"
firebase deploy
echo.
echo Listo. Si ves "Deploy complete!" ya esta publicado.
pause
endlocal
