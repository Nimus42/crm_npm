@echo off

:: =========================
:: COMPONENTS / LAYOUT
:: =========================
mkdir src\components
mkdir src\components\layout

type nul > src\components\layout\Sidebar.tsx

:: =========================
:: APP / (DASHBOARD)
:: =========================
mkdir "src\app\(dashboard)"
type nul > "src\app\(dashboard)\layout.tsx"

mkdir "src\app\(dashboard)\clients"
type nul > "src\app\(dashboard)\clients\page.tsx"
type nul > "src\app\(dashboard)\clients\AddClientModal.tsx"

echo.
echo ===== DASHBOARD STRUCTURE CREATED =====
pause