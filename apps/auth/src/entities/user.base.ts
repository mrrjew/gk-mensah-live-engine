import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb
} from "drizzle-orm/pg-core";

export const userTable = {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").default(''),
  firstName: text("first_name").default(''),
  lastName: text("last_name").default(''),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
  lastLogin: timestamp("last_login").defaultNow(),
  isActive: boolean("is_active").default(true),
  isEmailVerified: boolean("is_email_verified").default(false),
};
