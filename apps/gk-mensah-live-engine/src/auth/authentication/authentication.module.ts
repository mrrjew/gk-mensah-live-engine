import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationResolver } from './authentication.resolver';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [AuthenticationResolver],
  exports:[AuthenticationResolver]
})
export class AuthenticationModule {}