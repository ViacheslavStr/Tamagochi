import { pgTable, uuid, timestamp, text, jsonb } from 'drizzle-orm/pg-core';

// Заглушка для проверки подключения; дальше добавим users, families, children и т.д.
export const healthCheck = pgTable('health_check', {
  id: uuid('id').primaryKey().defaultRandom(),
  checkedAt: timestamp('checked_at', { withTimezone: true }).defaultNow().notNull(),
});
