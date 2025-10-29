CREATE TYPE "public"."user_type" AS ENUM('SuperAdmin', 'Admin', 'User');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "roles" "user_type";