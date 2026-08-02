@echo off

:: =========================
:: LMS
:: =========================
mkdir src\lms

type nul > src\lms\lms.module.ts
type nul > src\lms\courses.service.ts
type nul > src\lms\exams.service.ts
type nul > src\lms\lms.controller.ts

mkdir src\lms\dto

type nul > src\lms\dto\create-course.dto.ts
type nul > src\lms\dto\create-question.dto.ts
type nul > src\lms\dto\submit-exam.dto.ts

echo.
echo ===== LMS MODULE CREATED =====
pause