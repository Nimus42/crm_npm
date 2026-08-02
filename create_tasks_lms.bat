@echo off

echo =========================
echo COMPONENTS / LAYOUT
echo =========================

mkdir "src\components" 2>nul
mkdir "src\components\layout" 2>nul

type nul > "src\components\layout\Header.tsx"

echo.
echo =========================
echo DASHBOARD LAYOUT
echo =========================

mkdir "src\app\(dashboard)" 2>nul
type nul > "src\app\(dashboard)\layout.tsx"

echo.
echo =========================
echo TASKS
echo =========================

mkdir "src\app\(dashboard)\tasks" 2>nul
type nul > "src\app\(dashboard)\tasks\page.tsx"

echo.
echo =========================
echo LMS
echo =========================

mkdir "src\app\(dashboard)\lms" 2>nul
type nul > "src\app\(dashboard)\lms\page.tsx"

mkdir "src\app\(dashboard)\lms\[courseId]" 2>nul
mkdir "src\app\(dashboard)\lms\[courseId]\exam" 2>nul

type nul > "src\app\(dashboard)\lms\[courseId]\exam\page.tsx"

echo.
echo =========================
echo ГОТОВО
echo =========================
pause