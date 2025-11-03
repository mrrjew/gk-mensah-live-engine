CREATE TYPE "public"."user_type" AS ENUM('SuperAdmin', 'Admin', 'User');--> statement-breakpoint
CREATE TYPE "public"."subscription_feature" AS ENUM('LIVE_MEETINGS', 'REPLAY_ACCESS', 'STANDARD_SUPPORT', 'PRIORITY_SUPPORT', 'EXCLUSIVE_SESSIONS', 'PRIVATE_COMMUNITY', 'BASIC_SUPPORT');--> statement-breakpoint
CREATE TYPE "public"."payment_status_enum" AS ENUM('PENDING', 'REJECTED', 'APPROVED');--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text DEFAULT '',
	"first_name" text DEFAULT '',
	"last_name" text DEFAULT '',
	"password" text NOT NULL,
	"roles" "user_type",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_login" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"is_subscribed" boolean DEFAULT false,
	"is_email_verified" boolean DEFAULT false,
	"is_two_factor_enabled" boolean DEFAULT false,
	"two_factor_secret" text DEFAULT '',
	"two_factor_backup_codes" text[] DEFAULT '{}',
	"failed_login_attempts" integer DEFAULT 0,
	"last_failed_login" timestamp DEFAULT now(),
	"lock_expiry" timestamp DEFAULT now(),
	"password_reset_requested_at" timestamp DEFAULT now(),
	"password_reset_token" text DEFAULT '',
	"password_reset_token_expiry" timestamp DEFAULT now(),
	"last_password_reset" timestamp DEFAULT now(),
	"password_change_required" boolean DEFAULT false,
	"password_change_deadline" timestamp DEFAULT now(),
	"email_verification_token" text DEFAULT '',
	"email_verification_token_expiry" timestamp DEFAULT now(),
	"account_recovery_email" text DEFAULT '',
	"account_recovery_phone" text DEFAULT '',
	"account_recovery_token" text DEFAULT '',
	"account_recovery_token_expiry" timestamp DEFAULT now(),
	"account_recovery_requested_at" timestamp DEFAULT now(),
	"account_recovery_status" text DEFAULT 'pending',
	"account_recovery_method" text DEFAULT 'email',
	"account_recovery_verified" boolean DEFAULT false,
	"account_recovery_verification_token" text DEFAULT '',
	"account_recovery_verification_token_expiry" timestamp DEFAULT now(),
	"account_recovery_verification_requested_at" timestamp DEFAULT now(),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"device_info" jsonb DEFAULT '{}'::jsonb,
	"session_id" text DEFAULT '',
	"ip_address" text DEFAULT '',
	"user_agent" text DEFAULT '',
	"created_by" text DEFAULT '',
	"updated_by" text DEFAULT '',
	"deleted_at" timestamp DEFAULT now(),
	"deleted_by" text DEFAULT '',
	"account_status" text DEFAULT 'active',
	"security_questions" jsonb[] DEFAULT '{}',
	"security_answers" jsonb[] DEFAULT '{}',
	"last_security_question_change" timestamp DEFAULT now(),
	"last_security_answer_change" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"subscription_id" varchar NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT false,
	"payment_reference" varchar
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'GHS' NOT NULL,
	"duration_days" integer NOT NULL,
	"features" "subscription_feature"[] NOT NULL,
	"is_popular" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"membership_id" varchar NOT NULL,
	"amount" varchar(50) NOT NULL,
	"method" varchar(100) NOT NULL,
	"status" varchar(50),
	"payment_date" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_membership_id_memberships_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id") ON DELETE no action ON UPDATE no action;