import { pgTable, serial, integer, boolean, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { Users } from '../../users/entities/index';
import { Subscriptions } from '../../subscriptions/entities/subscriptions';
import { createId } from '@paralleldrive/cuid2';

export const Memberships = pgTable('memberships', {
  id: 
      varchar({ length: 255 })
      .primaryKey()
      .$defaultFn(() => createId())
      .notNull(),
  userId: varchar('user_id').notNull().references(() => Users.id),
  subscriptionId: varchar('subscription_id').notNull().references(() => Subscriptions.id),
  startDate: timestamp("start_date", { mode: 'date' }).notNull(),
  endDate: timestamp("end_date", { mode: 'date' }).notNull(),
  isActive: boolean('is_active').default(false),
  paymentReference: varchar('payment_reference'),
});


export const MembershipsRelations = relations(Memberships, ({ one }) => ({
  user: one(Users, {
    fields: [Memberships.userId],
    references: [Users.id],
  }),
  subscription: one(Subscriptions, {
    fields: [Memberships.subscriptionId],
    references: [Subscriptions.id],
  }),
}));
