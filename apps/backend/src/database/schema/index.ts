import { pgTable, uuid, timestamp, text, integer, pgEnum, jsonb } from 'drizzle-orm/pg-core';

// User role enum
export const userRoleEnum = pgEnum('user_role', ['mother', 'father', 'brother', 'sister']);

// User media type
export const userMediaTypeEnum = pgEnum('user_media_type', ['photo', 'video']);

// Users table
// Only email and password for registration. Personal data (firstName, lastName, age, role) goes to user_profiles
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(), // nullable: partner may not have email
  passwordHash: text('password_hash'), // nullable: partner created from questionnaire doesn't need password
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Refresh tokens table
export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- User profile (questionnaire) ---
// One profile per user - personal data + questionnaire
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  // Personal data (moved from users table)
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  age: integer('age').notNull(),
  role: userRoleEnum('role').notNull(),
  // Questionnaire
  height: text('height'),
  build: text('build'),
  ethnicity: text('ethnicity'),
  education: text('education'),
  interests: jsonb('interests').$type<string[]>().default([]),
  openness: integer('openness'),
  conscientiousness: integer('conscientiousness'),
  extraversion: integer('extraversion'),
  agreeableness: integer('agreeableness'),
  neuroticism: integer('neuroticism'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- User media (photos/videos) ---
// Photos/videos per user (storage path or URL)
export const userMedia = pgTable('user_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  filePath: text('file_path').notNull(), // path in storage or URL
  mediaType: userMediaTypeEnum('media_type').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Families ---
// Simple family: father + mother (both are users)
export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  fatherId: uuid('father_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  motherId: uuid('mother_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
