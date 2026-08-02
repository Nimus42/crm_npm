@echo off

:: =========================
:: FUNNEL
:: =========================
mkdir src\funnel
type nul > src\funnel\funnel.module.ts
type nul > src\funnel\funnel.service.ts
type nul > src\funnel\funnel.controller.ts

mkdir src\funnel\dto
type nul > src\funnel\dto\create-funnel-stage.dto.ts


:: =========================
:: PROJECTS
:: =========================
mkdir src\projects
type nul > src\projects\projects.module.ts
type nul > src\projects\projects.service.ts
type nul > src\projects\projects.controller.ts

mkdir src\projects\dto
type nul > src\projects\dto\create-expense.dto.ts


:: =========================
:: TASKS
:: =========================
mkdir src\tasks
type nul > src\tasks\tasks.module.ts
type nul > src\tasks\tasks.service.ts
type nul > src\tasks\tasks.controller.ts

mkdir src\tasks\dto
type nul > src\tasks\dto\create-task.dto.ts


echo.
echo ===== FUNNEL, PROJECTS, TASKS CREATED =====
pause