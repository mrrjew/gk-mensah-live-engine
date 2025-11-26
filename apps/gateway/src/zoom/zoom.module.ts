import { Module } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { ZoomResolver } from './zoom.resolver';
import { AdminGuard } from './admin.guard';
import { DrizzleService } from '@app/lib/core/drizzle/drizzle.service';
import { DrizzleModule } from '@app/lib/core/drizzle';

@Module({
  imports: [DrizzleModule],
  providers: [DrizzleService, ZoomService, ZoomResolver, AdminGuard],
  exports: [ZoomService],
})
export class ZoomModule {}
