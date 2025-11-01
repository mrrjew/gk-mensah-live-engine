import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModuleAsyncOptions, Transport } from "@nestjs/microservices";

const CLIENTS:ClientsModuleAsyncOptions = [
        {
          imports: [ConfigModule],
          name: 'CORE_SERVICE',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('CORE_HOST'),
              port: configService.get('CORE_PORT') || 3003, 
            },
          }),
          inject: [ConfigService],
        },
        {
          imports: [ConfigModule],
          name: 'PAYMENT_SERVICE',
          useFactory: async (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('PAYMENT_HOST'),
              port: configService.get('PAYMENT_PORT') || 3002, 
            },
          }),
          inject: [ConfigService],
        },
      ]

      export default CLIENTS