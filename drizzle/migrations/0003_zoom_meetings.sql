CREATE TABLE IF NOT EXISTS "zoom_meetings" (
  "id" varchar(255) PRIMARY KEY NOT NULL,
  "zoom_id" varchar(255) NOT NULL UNIQUE,
  "topic" varchar(255),
  "join_url" text,
  "password" varchar(255),
  "start_time" timestamp,
  "created_at" timestamp NOT NULL DEFAULT NOW()
);
