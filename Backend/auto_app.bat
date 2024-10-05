@echo off
:start
timeout /t 5 >nul  # Wait 5 seconds
ping -n 1 google.com >nul  # Check for internet connectivity

if %errorlevel%==0 (
    echo Internet connection available.
    start python app.py  # Start Python backend
    start ngrok http 5000  # Start ngrok tunnel (for Flask)
    goto end
) else (
    echo No internet. Retrying...
    goto start
)
:end