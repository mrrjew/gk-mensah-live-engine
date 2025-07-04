import { Pool } from '@neondatabase/serverless';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  public db: ReturnType<typeof drizzle>;
  private pool: Pool;

  onModuleInit() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    this.db = drizzle(this.pool, { schema });
    return 'Database connection established successfully';
  }

  onModuleDestroy() {
    if (this.pool) {
      this.pool.end();
    }
  }

  ping() {
    return { drizzle: 'pong' };
  }
}