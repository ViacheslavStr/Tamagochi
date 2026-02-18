import { pgTable, uuid, timestamp, text, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enum для ролей пользователя
export const userRoleEnum = pgEnum('user_role', ['mother', 'father', 'brother', 'sister']);

// Таблица пользователей
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  age: integer('age').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Заглушка для проверки подключения (можно удалить позже)
export const healthCheck = pgTable('health_check', {
  id: uuid('id').primaryKey().defaultRandom(),
  checkedAt: timestamp('checked_at', { withTimezone: true }).defaultNow().notNull(),
});
