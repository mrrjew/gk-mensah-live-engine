import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('CORE_SERVICE') private coreService: ClientProxy) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(access_token: string, refresh_token: string, profile: any) {
    try {
      console.log(profile)
      const payload = {
        username: profile.givenName,
        email: profile.emails[0].value,
        phoneNumber:profile.phoneNumber
      };
      console.log(access_token);
      const user = await this.coreService.send('validateThirdParty',payload);

      return user || null;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}