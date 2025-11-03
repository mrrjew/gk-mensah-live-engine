import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationResolver } from './authentication/authentication.resolver';
import { AuthenticationModule } from 'apps/core/src/core/authentication/authentication.module';
import { UsersResolver } from './users/users.resolver';
import { JwtMiddleware } from './common/middlewares/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { MembershipsResolver } from './memberships/memberships.resolver';
import { SubscriptionsResolver } from './subscriptions/subscriptions.resolver';

@Global()
@Module({
  imports: [AuthenticationModule],
  providers: [AuthenticationResolver,UsersResolver,MembershipsResolver,SubscriptionsResolver,JwtMiddleware,JwtService],
  exports: [AuthenticationModule],
})
export class CoreModule implements NestModule{
  configure(consumer:MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
