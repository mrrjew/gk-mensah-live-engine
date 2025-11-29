import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const protoDir = join(process.cwd(), 'proto');

const CLIENTS: ClientsModuleAsyncOptions = [
  {
    imports: [ConfigModule],
    name: 'CORE_SERVICE',
    useFactory: async (configService: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        package: 'core',
        protoPath: [join(protoDir, 'core.proto')],
        url: `${configService.get('CORE_HOST') || 'localhost'}:${configService.get('CORE_PORT') || 3003}`,
      },
    }),
    inject: [ConfigService],
  },
  {
    imports: [ConfigModule],
    name: 'PAYMENT_SERVICE',
    useFactory: async (configService: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        package: 'payment',
        protoPath: [join(protoDir, 'payment.proto')],
        url: `${configService.get('PAYMENT_HOST') || 'localhost'}:${configService.get('PAYMENT_PORT') || 3002}`,
      },
    }),
    inject: [ConfigService],
  },
];

export default CLIENTS;
