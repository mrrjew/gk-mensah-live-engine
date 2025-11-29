import { Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [DrizzleService, ConfigService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
