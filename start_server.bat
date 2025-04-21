@echo off
echo Starting Health Diagnostics System Server...
cd "C:\Users\ASUS\health_detective\backend"
python -m uvicorn main:app --reload --port 8080
pause 