import { createId } from '@paralleldrive/cuid2';
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  varchar,
} from 'drizzle-orm/pg-core';

export const UserRoles = ['SuperAdmin', 'Admin', 'User'] as const;

export type UserRole = (typeof UserRoles)[number];
export const UserRole = pgEnum('user_type', [
  UserRoles[0],
  ...UserRoles.slice(1),
]);

export const userTable = {
  id: varchar({ length: 255 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number').default(''),
  firstName: text('first_name').default(''),
  lastName: text('last_name').default(''),
  password: text('password').notNull(),
  role: UserRole().$defaultFn(() => 'User'),
  adminKey: text('admin_key').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  lastLogin: timestamp('last_login').defaultNow(),
  isActive: boolean('is_active').default(true),
  isSubscribed: boolean('is_subscribed').default(false),
  isEmailVerified: boolean('is_email_verified').default(false),
};
