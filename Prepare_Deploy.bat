@echo off
title KPCambodianmathematics - Deployment Preparer
color 0A
echo ========================================================
echo    KPCambodianmathematics - Deployment Packager
echo ========================================================
echo.
echo Packaging deployment files into 'dist' folder...
python "%~dp0build_dist.py"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  SUCCESS! Ready to deploy.
    echo  Opening 'dist' folder in File Explorer...
    echo ========================================================
    start "" explorer "%~dp0dist"
) else (
    echo.
    echo [ERROR] Failed to package files. Please check Python installation.
)
pause
