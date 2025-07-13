import { Pool } from 'pg';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  constructor(private configService:ConfigService) {}

  public db: ReturnType<typeof drizzle>;
  private pool: Pool;

  onModuleInit() {
    this.pool = new Pool({
      connectionString: this.configService.get<string>("DATABASE_URL"),
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