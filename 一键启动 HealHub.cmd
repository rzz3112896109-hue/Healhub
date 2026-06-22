@echo off
chcp 65001 >nul
title HealHub 智慧社区疗愈平台
echo 正在启动 HealHub，请稍候……
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-healhub.ps1"
if errorlevel 1 (
  echo.
  echo 启动失败，请截图此窗口并联系开发者。
  pause
)
