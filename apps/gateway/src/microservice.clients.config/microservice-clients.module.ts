import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import CLIENTS from './clients';

@Global()
@Module({
  imports: [ClientsModule.registerAsync(CLIENTS)],
  exports: [ClientsModule],
})
export class MicroserviceClientsModule {}
