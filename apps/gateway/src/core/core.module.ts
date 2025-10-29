import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationResolver } from './authentication/authentication.resolver';
import { AuthenticationModule } from 'apps/core/src/core/authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { UsersResolver } from './users/users.resolver';
import { JwtMiddleware } from './common/middlewares/jwt.middleware';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [AuthenticationModule, UsersModule,
    ClientsModule.registerAsync([
        {
          imports: [ConfigModule],
          name: 'CORE_SERVICE',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('CORE_HOST'),
              port: configService.get('CORE_PORT') || 3000, 
            },
          }),
          inject: [ConfigService],
        },
      ]),
    ],
  providers: [AuthenticationResolver,UsersResolver,JwtMiddleware,JwtService],
  exports: [AuthenticationModule,UsersModule],
})
export class CoreModule implements NestModule{
  configure(consumer:MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
