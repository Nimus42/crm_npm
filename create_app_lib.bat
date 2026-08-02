@echo off

:: =========================
:: APP
:: =========================
mkdir src\app

type nul > src\app\layout.tsx
type nul > src\app\page.tsx
type nul > src\app\globals.css

:: =========================
:: LIB
:: =========================
mkdir src\lib

type nul > src\lib\api.ts

echo.
echo ===== APP & LIB CREATED =====
pause