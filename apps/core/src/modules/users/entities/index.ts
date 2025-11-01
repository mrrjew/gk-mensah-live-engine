import { pgTable } from "drizzle-orm/pg-core";
import { userTable } from "./user.base";
import { userSecurityFields } from "./user.security";
import { userRecoveryFields } from "./user.recovery";
import { userMetadataFields } from "./user.metadata";
import { userAuditFields } from "./user.audit";
import { relations } from "drizzle-orm";
import { Payments } from "apps/payment/src/entities";

export const Users = pgTable("user", {
  ...userTable, 
  ...userSecurityFields,
  ...userRecoveryFields,
  ...userMetadataFields,
  ...userAuditFields,
});

export const usersRelations = relations(Users, ({ many }) => ({
  payments: many(Payments),
}));