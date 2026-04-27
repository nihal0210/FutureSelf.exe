@echo off
echo ===================================================
echo   SHADOW SLAYER - FUTURE YOU SIMULATOR LAUNCHER
echo ===================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ and try again.
    pause
    exit /b
)

:: Check if virtual environment exists
if not exist venv\ (
    echo [INFO] Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b
    )
)

:: Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate

:: Install dependencies
echo [INFO] Installing/Updating dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b
)

:: Check for .env file
if not exist .env (
    echo.
    echo [WARNING] No .env file found!
    echo Please copy .env.example to .env and configure your API keys.
    echo The app may crash if keys are missing.
    echo.
    pause
)

:: Run Flask
echo.
echo [INFO] Starting Shadow Slayer Server...
echo [INFO] Access the app at http://localhost:5000
echo.
set FLASK_APP=app.py
set FLASK_ENV=development
flask run --debug

pause
