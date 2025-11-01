import { Users } from "apps/core/src/modules/users/entities";
import { relations } from "drizzle-orm";
import { pgTable, serial, varchar,integer,boolean, pgEnum } from "drizzle-orm/pg-core";

export const PaymentStatusEnums = [
    'PENDING',
    'REJECTED',
    'APPROAVED'
]

export const PaymentStatusEnum = pgEnum('payment_status_enum',[PaymentStatusEnums[0],...PaymentStatusEnums.slice(1)])

export const Payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  membershipId: integer('membership_id').notNull(),
  amount: varchar('amount', { length: 50 }).notNull(),
  method: varchar('method', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }),
  paymentDate: varchar('payment_date', { length: 100 }).notNull(),
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
