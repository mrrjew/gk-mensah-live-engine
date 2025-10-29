import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { AuthenticationModule } from 'apps/core/src/core/authentication/authentication.module';
import { DrizzleModule } from 'libs/core/src/drizzle';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [AuthenticationModule,DrizzleModule, UsersModule],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {

}
