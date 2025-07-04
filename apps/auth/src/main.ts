import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_HOST || 'localhost',
      port: parseInt(process.env.AUTH_PORT || "3000", 10) || 30,
    },
  });
    app.listen()
}

bootstrap();
