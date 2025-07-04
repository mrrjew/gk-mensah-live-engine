import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
