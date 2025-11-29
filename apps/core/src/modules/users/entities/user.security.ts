import { boolean, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const userSecurityFields = {
  isTwoFactorEnabled: boolean('is_two_factor_enabled').default(false),
  twoFactorSecret: text('two_factor_secret').default(''),
  twoFactorBackupCodes: text('two_factor_backup_codes').array().default([]),

  failedLoginAttempts: integer('failed_login_attempts').default(0),
  lastFailedLogin: timestamp('last_failed_login').defaultNow(),
  lockExpiry: timestamp('lock_expiry').defaultNow(),

  passwordResetRequestedAt: timestamp(
    'password_reset_requested_at',
  ).defaultNow(),
  passwordResetToken: text('password_reset_token').default(''),
  passwordResetTokenExpiry: timestamp(
    'password_reset_token_expiry',
  ).defaultNow(),
  lastPasswordReset: timestamp('last_password_reset').defaultNow(),
  passwordChangeRequired: boolean('password_change_required').default(false),
  passwordChangeDeadline: timestamp('password_change_deadline').defaultNow(),

  emailVerificationToken: text('email_verification_token').default(''),
  emailVerificationTokenExpiry: timestamp(
    'email_verification_token_expiry',
  ).defaultNow(),
};
