import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { DrizzleService } from '@app/lib/drizzle.service';
import { DrizzleModule } from '@app/lib';

@Module({
  imports:[DrizzleModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService,DrizzleService],
})
export class AuthenticationModule {}
