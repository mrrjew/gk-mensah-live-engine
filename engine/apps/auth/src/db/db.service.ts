import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

@Injectable()
export class DbService implements OnModuleDestroy {
  private pool: Pool;
  public db: ReturnType<typeof drizzle>;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(this.pool);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }}