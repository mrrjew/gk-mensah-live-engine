import { Controller, Get,Req, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('pingAuthentication')
  ping() {
    return "authentication service is up and running";
  }
  
  @MessagePattern('pingAuthenticationDatabase')
  pingDatabase() {
    return this.authenticationService.pingDatabase();
  }
  
  @MessagePattern({service:'authentication',cmd:'createUser'})
  async createUser(payload: CreateUserDto) {
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
  
  @MessagePattern({service:'authentication',cmd:'loginUser'})
  // @UseGuards(AuthGuard('local'))
  async loginUser(payload: any) {
    return this.authenticationService.validateUser(payload);
  }

}
