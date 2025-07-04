import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('pingAuthentication')
  ping() {
    return "authentication service is up and running";
  }

}
