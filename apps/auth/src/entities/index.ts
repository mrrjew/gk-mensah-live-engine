import { pgTable } from "drizzle-orm/pg-core";
import { userTable } from "./user.base";
import { userSecurityFields } from "./user.security";
import { userRecoveryFields } from "./user.recovery";
import { userMetadataFields } from "./user.metadata";
import { userAuditFields } from "./user.audit";

export const userSchema = pgTable("user", {
  ...userTable, 
  ...userSecurityFields,
  ...userRecoveryFields,
  ...userMetadataFields,
  ...userAuditFields,
});
