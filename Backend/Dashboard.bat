@echo off
start /B streamlit run dashboard.py --server.headless true --server.port 8501
timeout /t 2 /nobreak >nul  # Wait for the server to start
start http://localhost:8501