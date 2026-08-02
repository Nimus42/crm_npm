@echo off

mkdir CRM-RushdDigital
cd CRM-RushdDigital

mkdir prisma
type nul > prisma\schema.prisma

mkdir src
type nul > src\main.ts
type nul > src\app.module.ts

mkdir src\prisma
type nul > src\prisma\prisma.module.ts
type nul > src\prisma\prisma.service.ts

mkdir src\users
type nul > src\users\users.module.ts
type nul > src\users\users.service.ts
type nul > src\users\users.controller.ts

mkdir src\auth
type nul > src\auth\auth.module.ts
type nul > src\auth\auth.service.ts
type nul > src\auth\auth.controller.ts

mkdir src\auth\dto
type nul > src\auth\dto\register.dto.ts
type nul > src\auth\dto\login.dto.ts

mkdir src\auth\strategies
type nul > src\auth\strategies\jwt.strategy.ts
type nul > src\auth\strategies\jwt-refresh.strategy.ts

mkdir src\auth\guards
type nul > src\auth\guards\jwt-auth.guard.ts
type nul > src\auth\guards\jwt-refresh.guard.ts
type nul > src\auth\guards\roles.guard.ts

mkdir src\auth\decorators
type nul > src\auth\decorators\roles.decorator.ts
type nul > src\auth\decorators\get-user.decorator.ts

echo.
echo ===== ГОТОВО =====
pause