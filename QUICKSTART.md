# Быстрый старт

## Первая установка

1. **Установите зависимости:**
   ```bash
   pnpm install
   ```

2. **Настройте переменные окружения:**
   
   Скопируйте примеры и заполните нужные ключи:
   ```bash
   cp apps/frontend/.env.example apps/frontend/.env.local
   cp apps/backend/.env.example apps/backend/.env.local
   ```
   
   Откройте `apps/backend/.env.local` и добавьте API ключи (минимум для начала работы не обязательны, но понадобятся для полной функциональности).

3. **Запустите проект:**
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
