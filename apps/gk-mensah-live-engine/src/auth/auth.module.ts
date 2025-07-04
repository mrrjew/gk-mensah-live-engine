import { Module } from '@nestjs/common';
import { AuthenticationResolver } from './authentication/authentication.resolver';
import { AuthenticationModule } from 'apps/auth/authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [AuthenticationModule, 
    ClientsModule.registerAsync([
        {
          imports: [ConfigModule],
          name: 'AUTH_SERVICE',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('AUTH_HOST'),
              port: configService.get('AUTH_PORT') || 3000, 
            },
          }),
          inject: [ConfigService],
        },
      ]),],
  providers: [AuthenticationResolver],
  exports: [AuthenticationModule],
})
export class AuthModule {}
