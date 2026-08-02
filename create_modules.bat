@echo off

:: =========================
:: CLIENTS
:: =========================
mkdir src\clients
type nul > src\clients\clients.module.ts
type nul > src\clients\clients.service.ts
type nul > src\clients\clients.controller.ts
type nul > src\clients\client-audit.interceptor.ts

mkdir src\clients\dto
type nul > src\clients\dto\create-client.dto.ts
type nul > src\clients\dto\update-client.dto.ts

:: =========================
:: LEAD SOURCES
:: =========================
mkdir src\lead-sources
type nul > src\lead-sources\lead-sources.module.ts
type nul > src\lead-sources\lead-sources.service.ts
type nul > src\lead-sources\lead-sources.controller.ts

mkdir src\lead-sources\dto
type nul > src\lead-sources\dto\create-lead-source.dto.ts

:: =========================
:: ACTION LOGS
:: =========================
mkdir src\action-logs
type nul > src\action-logs\action-logs.module.ts
type nul > src\action-logs\action-logs.service.ts

echo.
echo ===== МОДУЛИ СОЗДАНЫ =====
pause