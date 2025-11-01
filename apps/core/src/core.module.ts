import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { AuthenticationModule } from 'apps/core/src/core/authentication/authentication.module';
import { DrizzleModule } from 'libs/core/src/drizzle';
import { UsersModule } from './modules/users/users.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { MembershipsModule } from './modules/memberships/memberships.module';

@Module({
  imports: [AuthenticationModule,DrizzleModule, UsersModule,SubscriptionsModule,MembershipsModule],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {

}
