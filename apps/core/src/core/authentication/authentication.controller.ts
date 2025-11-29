import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @GrpcMethod('AuthenticationService', 'Ping')
  ping() {
    return { message: 'authentication service is up and running' };
  }

  @GrpcMethod('AuthenticationService', 'PingDatabase')
  async pingDatabase() {
    const status = await this.authenticationService.pingDatabase();
    return { message: status?.message ?? 'authentication database reachable' };
  }

  @GrpcMethod('AuthenticationService', 'CreateUser')
  async createUser(payload: CreateUserDto) {
    return this.authenticationService.createUser(payload);
  }

  @GrpcMethod('AuthenticationService', 'CreateAdminUser')
  async createAdminUser(payload: CreateUserDto) {
    return this.authenticationService.createUser(payload);
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  handleGoogleOAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  handleGoogleOAuthRedirect(@Req() req, @Res() res) {
    const token = req.user.access_token;
    return res.redirect(`${process.env.CLIENT_URL}?access_token=${token}`);
  }

  @GrpcMethod('AuthenticationService', 'LoginUser')
  async loginUser(payload: any) {
    const res = await this.authenticationService.validateUser(payload);
    console.log('service', res);
    return res;
  }

  @GrpcMethod('AuthenticationService', 'ValidateThirdParty')
  async validateThirdParty(payload: any) {
    return this.authenticationService.validateThirdParty(payload);
  }
}
