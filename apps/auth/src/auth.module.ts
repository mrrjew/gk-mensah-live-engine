import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { DrizzleModule } from 'libs/core/src/drizzle';

@Module({
  imports: [AuthenticationModule,DrizzleModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
