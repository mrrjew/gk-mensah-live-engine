export default {
    schema: ['./apps/core/src/entities'],
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
   }
}