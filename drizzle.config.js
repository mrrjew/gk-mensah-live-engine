export default {
    schema: ['./apps/gk-mensah-live-engine/src/database','./apps/auth/src/database'],
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
   }
}