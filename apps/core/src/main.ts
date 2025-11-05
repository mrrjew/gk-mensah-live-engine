import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exception.filters/all.exceptions.filter';

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
    transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());


  console.log(`Core microservice is running on port ${process.env.CORE_PORT || 3003}`);

  console.log('📡 Registered message handlers:', app['messageHandlers']);

    app.listen()
}

bootstrap();
