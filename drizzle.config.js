import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: [
    './apps/core/src/modules/users/entities/**/*.ts',
    './apps/core/src/modules/memberships/entities/**/*.ts',
    './apps/core/src/modules/subscriptions/entities/**/*.ts',
    './apps/payment/src/entities/**/*.ts',
  ],
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
