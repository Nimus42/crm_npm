@echo off

:: =========================
:: NOTIFICATIONS
:: =========================
mkdir src\notifications

type nul > src\notifications\notifications.module.ts
type nul > src\notifications\notifications.service.ts
type nul > src\notifications\notifications.controller.ts


:: =========================
:: TELEGRAM
:: =========================
mkdir src\telegram

type nul > src\telegram\telegram.module.ts
type nul > src\telegram\telegram.service.ts


:: =========================
:: CLIENTS CSV
:: =========================
mkdir src\clients

type nul > src\clients\clients-csv.service.ts
type nul > src\clients\clients-csv.controller.ts


echo.
echo ===== NOTIFICATIONS, TELEGRAM, CLIENTS CSV CREATED =====
pause