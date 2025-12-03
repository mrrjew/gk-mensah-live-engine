ALTER TABLE "subscriptions" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;
ALTER TABLE "subscriptions" ADD COLUMN "archived_at" timestamp;
