import { createId } from "@paralleldrive/cuid2";
import { Memberships } from "apps/core/src/modules/memberships/entities/memberships.entities";
import { Users } from "apps/core/src/modules/users/entities";
import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const PaymentStatusEnum = pgEnum("payment_status_enum", [
  "PENDING",
  "REJECTED",
  "APPROVED",
]);

export const Payments = pgTable("payments", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),

  userId: varchar("user_id", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull(),

  membershipId: varchar("membership_id", { length: 255 })
    .references(() => Memberships.id)
    .notNull(),

  amount: varchar("amount", { length: 50 }).notNull(),

  method: varchar("method", { length: 100 }).notNull(),

  status: PaymentStatusEnum("status").default("PENDING").notNull(),

  reference: varchar("reference", { length: 255 }),

  paymentDate: timestamp("payment_date", { mode: "date" }).notNull(),
});

export type Payment = typeof Payments.$inferSelect;
export type NewPayment = typeof Payments.$inferInsert;
export type UpdatePaymentDto = Partial<Payment>;

export const paymentsRelations = relations(Payments, ({ one }) => ({
  user: one(Users, {
    fields: [Payments.userId],
    references: [Users.id],
  }),
  membership: one(Memberships, {
    fields: [Payments.membershipId],
    references: [Memberships.id],
  }),
}));
