@echo off

:: =========================
:: APP / (DASHBOARD) / FUNNEL
:: =========================
mkdir "src\app\(dashboard)\funnel"
type nul > "src\app\(dashboard)\funnel\page.tsx"

:: =========================
:: APP / (DASHBOARD) / PROJECTS
:: =========================
mkdir "src\app\(dashboard)\projects"
type nul > "src\app\(dashboard)\projects\page.tsx"
type nul > "src\app\(dashboard)\projects\AddExpenseModal.tsx"

echo.
echo ===== FUNNEL & PROJECTS CREATED =====
pause