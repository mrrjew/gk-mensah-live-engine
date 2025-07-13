import { boolean, text, timestamp, integer } from "drizzle-orm/pg-core";

export const userRecoveryFields = {
  accountRecoveryEmail: text("account_recovery_email").default(''),
  accountRecoveryPhone: text("account_recovery_phone").default(''),
  accountRecoveryToken: text("account_recovery_token").default(''),
  accountRecoveryTokenExpiry: timestamp("account_recovery_token_expiry").defaultNow(),
  accountRecoveryRequestedAt: timestamp("account_recovery_requested_at").defaultNow(),

  accountRecoveryStatus: text("account_recovery_status").default("pending"),
  accountRecoveryMethod: text("account_recovery_method").default("email"),
  accountRecoveryVerified: boolean("account_recovery_verified").default(false),

  accountRecoveryVerificationToken: text("account_recovery_verification_token").default(''),
  accountRecoveryVerificationTokenExpiry: timestamp("account_recovery_verification_token_expiry").defaultNow(),
  accountRecoveryVerificationRequestedAt: timestamp("account_recovery_verification_requested_at").defaultNow(),
};
