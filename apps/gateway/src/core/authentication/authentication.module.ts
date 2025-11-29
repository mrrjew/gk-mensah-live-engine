import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationResolver } from './authentication.resolver';

@Module({
  imports: [ConfigModule],
  providers: [AuthenticationResolver],
  exports: [AuthenticationResolver],
})
export class AuthenticationModule {}
