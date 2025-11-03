import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './membership.controller';
import { DrizzleModule, DrizzleService } from '@app/lib/core/drizzle';

@Module({
  imports: [DrizzleModule],
  controllers: [MembershipsController],
  providers: [DrizzleService, MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
