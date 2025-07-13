ALTER TABLE "user" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone_number" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "first_name" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text DEFAULT '';