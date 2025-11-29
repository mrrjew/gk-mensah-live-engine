import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { DrizzleService } from '@app/lib/core/drizzle';
import { DrizzleModule } from '@app/lib/core/drizzle';
import { HashService } from '@app/lib/core/hashing';
import { HashModule } from '@app/lib/core/hashing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    DrizzleModule,
    HashModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, DrizzleService, HashService],
})
export class AuthenticationModule {}
