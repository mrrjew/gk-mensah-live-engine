CREATE TABLE "zoom_meetings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"zoom_id" varchar(255) NOT NULL,
	"topic" varchar(255),
	"join_url" text,
	"start_url" text,
	"password" varchar(255),
	"start_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "zoom_meetings_zoom_id_unique" UNIQUE("zoom_id")
);
