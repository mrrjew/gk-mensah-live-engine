import { Controller, Get, Head } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller()
export class CoreController {
  constructor(private readonly CoreService: CoreService) {}

  @Get()
  getHello(): string {
    return this.CoreService.getHello();
  }

  @Head()
  healthCheck(): string {
    return 'OK';
  }
}
