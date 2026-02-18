# Tamagochi — Электронный ребёнок

Симуляция «ребёнка» для пары: загрузка фото/видео и анкеты родителей → ИИ формирует модель ребёнка (внешность + характер) → ребёнок растёт, общается и выражает эмоции в приложении.

## Документация

Полное техническое решение, стек и этапы реализации: **[docs/DESIGN.md](docs/DESIGN.md)**.

## Структура проекта (монорепо)

```
tamagochi/
├── apps/
│   ├── frontend/      # Next.js (React) — фронтенд
│   └── backend/       # NestJS — бэкенд (API, крон, WebSocket)
├── packages/
│   └── shared/        # Общие типы и утилиты
├── turbo.json         # Конфигурация Turborepo
└── pnpm-workspace.yaml
```

## Технологии

- **Фронтенд:** Next.js (React)
- **Бэкенд:** NestJS (API, крон, WebSocket, очереди)
- **Монорепо:** Turborepo + pnpm workspaces
- **Общие типы:** TypeScript shared package
- **ИИ:** Готовые API (Replicate, OpenAI и т.д.)

## Требования

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Установка

```bash
# Установить зависимости для всех пакетов
pnpm install
```

## Разработка

```bash
# Запустить фронтенд и бэкенд в режиме разработки
pnpm dev

# Или запустить отдельно:
pnpm --filter frontend dev  # http://localhost:3000
pnpm --filter backend dev   # http://localhost:3001
```

## Сборка

```bash
# Собрать все приложения
pnpm build
```

## Структура команд

- `pnpm dev` — запуск всех приложений в dev режиме
- `pnpm build` — сборка всех приложений
- `pnpm lint` — линтинг всех пакетов
- `pnpm format` — форматирование кода (Prettier)
- `pnpm type-check` — проверка типов во всех пакетах

## Переменные окружения

Создайте файлы `.env.local` в соответствующих приложениях:

**apps/frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**apps/backend/.env.local:**
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
# Добавьте ключи API для Replicate, OpenAI и т.д.
```

## Кратко по технологиям

- **Стек:** Next.js (фронт) + NestJS (бэкенд: API, крон, WebSocket, очереди). Свои ИИ-модели не пишем — только вызов **готовых API** (Replicate, OpenAI и т.д.).
- **Внешность:** генерация лица по фото родителей через Replicate (BlendGAN, SAM, FLUX), возрастная прогрессия.
- **Анкета:** маппинг ответов в «гены» и черты личности для симуляции.
- **Состояние:** БД (SQLite/Postgres) — возраст, личность, память, события; симуляция времени.
- **Диалог:** LLM (OpenAI/Claude) по API; опционально TTS + talking head (D-ID и др.).
