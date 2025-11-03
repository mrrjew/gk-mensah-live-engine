import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CoreModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.CORE_HOST || 'localhost',
      port: parseInt(process.env.CORE_PORT || '3003'),
    },
  });

  app.useGlobalPipes(
  new ValidationPipe({
    transform: true, // 👈 ensures plain strings become proper Date objects
  }),
);



  console.log(`Core microservice is running on port ${process.env.CORE_PORT || 3003}`);

  console.log('📡 Registered message handlers:', app['messageHandlers']);

    app.listen()
}

bootstrap();
