@echo off
cd /d "%~dp0"
set "PORTFOLIO_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%PORTFOLIO_NODE%" set "PORTFOLIO_NODE=node"
if not exist "node_modules\vite\bin\vite.js" (
  echo Please install dependencies first: npm install
  pause
  exit /b 1
)
echo Portfolio preview: http://127.0.0.1:5173/
echo Keep this window open while previewing. Press Ctrl+C to stop.
"%PORTFOLIO_NODE%" "node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173 --strictPort
pause

