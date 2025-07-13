import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { DrizzleService } from '@app/lib/core/drizzle';
import { DrizzleModule } from '@app/lib/core/drizzle';
import { HashService } from '@app/lib/core/hashing';
import { HashModule } from '@app/lib/core/hashing';

@Module({
  imports:[DrizzleModule,HashModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService,DrizzleService,HashService],
})
export class AuthenticationModule {}
