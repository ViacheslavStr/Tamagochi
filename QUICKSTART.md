# Быстрый старт

## Первая установка

1. **Установите зависимости:**
   ```bash
   pnpm install
   ```

2. **PostgreSQL:** отдельный кластер PostgreSQL 17 уже создан на порту 5433.
   
   **Запуск кластера:**
   ```bash
   ./scripts/start-postgres-tamagochi.sh
   # или
   pg_ctl -D ~/postgres-tamagochi -l ~/postgres-tamagochi/logfile start
   ```
   
   **Добавление в PGAdmin:**
   - Правый клик на "Servers" → "Register" → "Server..."
   - Name: `Tamagochi`
   - Host: `localhost`, Port: `5433`
   - Database: `tamagochi`
   - Username: ваше имя пользователя macOS
   
   **Остановка:**
   ```bash
   ./scripts/stop-postgres-tamagochi.sh
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
   # Генерация миграций из схемы
   pnpm --filter backend db:generate
   # Применение миграций к БД
   pnpm --filter backend db:migrate
   
   # Альтернатива для разработки: быстрое применение изменений без миграций
   # pnpm --filter backend db:push
   ```

4. **Запустите проект:**
   ```bash
   pnpm dev
   ```
   
   Это запустит:
   - Frontend на http://localhost:3301
   - Backend на http://localhost:3300

## Проверка работы

- Frontend: откройте http://localhost:3301 — должна открыться страница с заголовком "Tamagochi — Электронный ребёнок"
- Backend: откройте http://localhost:3300/health — должен вернуться `{"status":"ok","timestamp":"..."}`

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
