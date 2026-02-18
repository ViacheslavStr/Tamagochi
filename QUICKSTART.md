# Быстрый старт

## Первая установка

1. **Установите зависимости:**
   ```bash
   pnpm install
   ```

2. **PostgreSQL:** бэкенд использует PostgreSQL. Запустите сервер и создайте базу:
   ```bash
   # Локально: создайте БД (пример для macOS с Homebrew)
   createdb tamagochi

   # Или через Docker Compose (из корня проекта):
   docker compose up -d
   # Тогда в .env.local: DATABASE_URL=postgresql://tamagochi:tamagochi@localhost:5432/tamagochi
   ```

3. **Настройте переменные окружения:**
   
   Скопируйте примеры и заполните нужные ключи:
   ```bash
   cp apps/frontend/.env.example apps/frontend/.env.local
   cp apps/backend/.env.example apps/backend/.env.local
   ```
   
   В `apps/backend/.env.local` обязательно укажите **DATABASE_URL** (подставьте свои user/password/host при необходимости):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/tamagochi
   ```
   Остальные API ключи (Replicate, OpenAI и т.д.) понадобятся позже для полной функциональности.

   После первого запуска БД примените миграции Drizzle (из корня или из `apps/backend`):
   ```bash
   pnpm --filter backend db:generate
   pnpm --filter backend db:migrate
   ```

4. **Запустите проект:**
   ```bash
   pnpm dev
   ```
   
   Это запустит:
   - Frontend на http://localhost:3000
   - Backend на http://localhost:3001

## Проверка работы

- Frontend: откройте http://localhost:3000 — должна открыться страница с заголовком "Tamagochi — Электронный ребёнок"
- Backend: откройте http://localhost:3001/health — должен вернуться `{"status":"ok","timestamp":"..."}`

## Структура команд

- `pnpm dev` — запуск всех приложений
- `pnpm build` — сборка всех приложений
- `pnpm lint` — проверка кода
- `pnpm format` — форматирование кода

## Работа с отдельными пакетами

```bash
# Только фронтенд
pnpm --filter frontend dev

# Только бэкенд
pnpm --filter backend dev

# Только shared пакет (проверка типов)
pnpm --filter @tamagochi/shared type-check
```
