# Настройка отдельного PostgreSQL через Homebrew

## Вариант 1: Установить другую версию PostgreSQL (рекомендуется)

Если у вас уже установлен PostgreSQL (например, версия 15), установите другую версию (например, 16) - она автоматически будет на другом порту.

```bash
# Проверьте текущую версию
psql --version

# Установите другую версию PostgreSQL (например, 16, если у вас 15)
brew install postgresql@16

# Запустите новый PostgreSQL на порту 5433
brew services start postgresql@16 --port=5433

# Или создайте кластер на другом порту вручную
initdb -D /opt/homebrew/var/postgresql@16 -p 5433
brew services start postgresql@16
```

## Вариант 2: Настроить существующий PostgreSQL на второй порт

Если хотите использовать ту же версию, создайте второй кластер:

```bash
# Создайте директорию для нового кластера
mkdir -p ~/postgres-tamagochi

# Инициализируйте новый кластер на порту 5433
initdb -D ~/postgres-tamagochi -p 5433

# Отредактируйте postgresql.conf
echo "port = 5433" >> ~/postgres-tamagochi/postgresql.conf

# Запустите PostgreSQL на втором порту
pg_ctl -D ~/postgres-tamagochi -l ~/postgres-tamagochi/logfile start

# Создайте базу данных
createdb -p 5433 -h localhost tamagochi
```

## Вариант 3: Использовать существующий PostgreSQL (проще всего)

Если не нужен отдельный сервер, просто создайте отдельную БД в существующем PostgreSQL:

```bash
# Создайте БД в существующем PostgreSQL
createdb tamagochi

# В .env укажите:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tamagochi
```

## Добавление сервера в PGAdmin

После установки отдельного PostgreSQL:

1. **Откройте PGAdmin**

2. **Правый клик на "Servers" → "Register" → "Server..."**

3. **Вкладка "General":**
   - Name: `Tamagochi`

4. **Вкладка "Connection":**
   - Host name/address: `localhost`
   - Port: `5433` (или ваш порт)
   - Maintenance database: `postgres` (или `tamagochi` если уже создана)
   - Username: ваш пользователь (обычно имя пользователя macOS или `postgres`)
   - Password: ваш пароль
   - ✅ Save password

5. **Нажмите "Save"**

6. **Создайте БД `tamagochi`** в новом сервере через PGAdmin

## Автозапуск при загрузке системы

Для варианта 1 (другая версия):
```bash
brew services start postgresql@16
```

Для варианта 2 (второй кластер), создайте plist файл или используйте launchd.
