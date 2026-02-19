import { pgTable, uuid, timestamp, text, integer, pgEnum, jsonb, unique } from 'drizzle-orm/pg-core';

// User role enum
export const userRoleEnum = pgEnum('user_role', ['mother', 'father', 'brother', 'sister']);

// Family parent role (order in the pair)
export const familyParentRoleEnum = pgEnum('family_parent_role', ['parent1', 'parent2']);

// Parent media type
export const parentMediaTypeEnum = pgEnum('parent_media_type', ['photo', 'video']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  age: integer('age').notNull(),
  role: userRoleEnum('role').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
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

// Health check table (can be removed later)
export const healthCheck = pgTable('health_check', {
  id: uuid('id').primaryKey().defaultRandom(),
  checkedAt: timestamp('checked_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Onboarding: parents, questionnaire, photos ---

// One record per "parent" (the user or the partner/celebrity). Questionnaire data lives here.
export const parentProfiles = pgTable('parent_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }), // set when this profile is the logged-in user
  firstName: text('first_name'),
  lastName: text('last_name'),
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

// Photos/videos per parent profile (storage path or URL)
export const parentMedia = pgTable('parent_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentProfileId: uuid('parent_profile_id')
    .notNull()
    .references(() => parentProfiles.id, { onDelete: 'cascade' }),
  filePath: text('file_path').notNull(), // path in storage or URL
  mediaType: parentMediaTypeEnum('media_type').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// A "family" is the pair of two parents (created by the logged-in user)
export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdByUserId: uuid('created_by_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Junction: which parent profiles belong to which family, and their role (parent1 / parent2)
export const familyParents = pgTable(
  'family_parents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id, { onDelete: 'cascade' }),
    parentProfileId: uuid('parent_profile_id')
      .notNull()
      .references(() => parentProfiles.id, { onDelete: 'cascade' }),
    role: familyParentRoleEnum('role').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    familyParentsFamilyRoleUnique: unique('family_parents_family_role_unique').on(table.familyId, table.role),
  }),
);
