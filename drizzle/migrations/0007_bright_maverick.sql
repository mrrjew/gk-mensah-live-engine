ALTER TABLE "memberships" ALTER COLUMN "start_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "is_active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "membership_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "order_id";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "recurring";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "is_valid_until";