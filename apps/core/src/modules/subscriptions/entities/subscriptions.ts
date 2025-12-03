import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { Memberships } from '../../memberships/entities/memberships.entities';
import { createId } from '@paralleldrive/cuid2';

// Enum for features
export const subscriptionFeatureEnum = pgEnum('subscription_feature', [
  'LIVE_MEETINGS',
  'REPLAY_ACCESS',
  'STANDARD_SUPPORT',
  'PRIORITY_SUPPORT',
  'EXCLUSIVE_SESSIONS',
  'PRIVATE_COMMUNITY',
  'BASIC_SUPPORT',
]);

// Main table
export const Subscriptions = pgTable('subscriptions', {
  id: varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('GHS'),
  durationDays: integer('duration_days').notNull(),
  features: subscriptionFeatureEnum('features').array().notNull(),
  mostPopular: boolean('most_popular').default(false),
  isArchived: boolean('is_archived').default(false).notNull(),
  archivedAt: timestamp('archived_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subscriptionsRelations = relations(Subscriptions, ({ many }) => ({
  memberships: many(Memberships),
}));
