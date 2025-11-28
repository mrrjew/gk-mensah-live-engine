import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const zoomMeetings = pgTable('zoom_meetings', {
  id: varchar('id', { length: 255 }).primaryKey(),
  zoomId: varchar('zoom_id', { length: 255 }).notNull().unique(),
  topic: varchar('topic', { length: 255 }),
  joinUrl: text('join_url'),
  startUrl: text('start_url'),
  password: varchar('password', { length: 255 }),
  startTime: timestamp('start_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
