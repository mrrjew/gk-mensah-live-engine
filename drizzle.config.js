export default {
    schema: ['./apps/auth/src/entities'],
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
   }
}