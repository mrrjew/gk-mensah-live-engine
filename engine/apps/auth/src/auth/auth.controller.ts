import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('signup')
  async signup(data: { email: string; password: string }) {
    return this.authService.signup(data.email, data.password);
  }

  @MessagePattern('signin')
  async signin(data: { email: string; password: string }) {
    return this.authService.signin(data.email, data.password);
  }
}
