@echo off

:: =========================
:: STORE
:: =========================
mkdir src\store
type nul > src\store\auth.ts

:: =========================
:: COMPONENTS / GUARDS
:: =========================
mkdir src\components
mkdir src\components\guards

type nul > src\components\guards\AuthGuard.tsx
type nul > src\components\guards\GuestGuard.tsx

:: =========================
:: APP / AUTH
:: =========================
mkdir src\app
mkdir src\app\auth

type nul > src\app\auth\layout.tsx

mkdir src\app\auth\login
type nul > src\app\auth\login\page.tsx

mkdir src\app\auth\register
type nul > src\app\auth\register\page.tsx

echo.
echo ===== AUTH STRUCTURE CREATED =====
pause