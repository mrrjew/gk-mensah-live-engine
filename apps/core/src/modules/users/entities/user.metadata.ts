import { jsonb, text, integer } from 'drizzle-orm/pg-core';

export const userMetadataFields = {
  metadata: jsonb('metadata').default({}),
  deviceInfo: jsonb('device_info').default({}),
  sessionId: text('session_id').default(''),
  ipAddress: text('ip_address').default(''),
  userAgent: text('user_agent').default(''),
};
