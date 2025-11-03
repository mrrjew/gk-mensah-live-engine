import { createId } from "@paralleldrive/cuid2";
import { Memberships } from "apps/core/src/modules/memberships/entities/memberships.entities";
import { Users } from "apps/core/src/modules/users/entities";
import { relations } from "drizzle-orm";
import { pgTable, serial, varchar,integer,boolean, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const PaymentStatusEnums = [
    'PENDING',
    'REJECTED',
    'APPROVED'
]

export const PaymentStatusEnum = pgEnum('payment_status_enum',[PaymentStatusEnums[0],...PaymentStatusEnums.slice(1)])

export const Payments = pgTable('payments', {
    id: 
        varchar({ length: 255 })
        .primaryKey()
        .$defaultFn(() => createId())
        .notNull(),
  userId: varchar('user_id').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  membershipId: varchar('membership_id').references(() => Memberships.id).notNull(),
  amount: varchar('amount', { length: 50 }).notNull(),
  method: varchar('method', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }),
  paymentDate: timestamp('payment_date',{mode:'date'}).notNull(),
});

export type Payment = typeof Payments.$inferSelect;
export type NewPayment = typeof Payments.$inferInsert;
export type UpdatePaymentDto = Partial<Payment>;

export const paymentsRelations = relations(Payments, ({ one }) => ({
  user: one(Users, {
    fields: [Payments.userId],
    references: [Users.id],
  })
}));
