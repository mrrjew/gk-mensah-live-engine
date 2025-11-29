import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { lastValueFrom } from 'rxjs';
import { AuthenticationGrpcService } from '../../grpc/core-grpc.types';

@Injectable()
export class GoogleOauthStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private authService: AuthenticationGrpcService;

  constructor(@Inject('CORE_SERVICE') private coreService: ClientGrpc) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  onModuleInit() {
    this.authService = this.coreService.getService<AuthenticationGrpcService>(
      'AuthenticationService',
    );
  }

  async validate(access_token: string, refresh_token: string, profile: any) {
    try {
      console.log(profile);
      const payload = {
        username: profile.givenName,
        email: profile.emails[0].value,
        phoneNumber: profile.phoneNumber,
      };
      console.log(access_token);
      const user = await lastValueFrom(
        this.authService.validateThirdParty(payload),
      );

      return user || null;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
