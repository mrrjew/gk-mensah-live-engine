import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  @MessagePattern('createUser')
  async createUser(userData: CreateUserDto) {
    return this.authenticationService.createUser(userData);
  }
}
