import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exception.filters/all.exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  const express = app.getHttpAdapter().getInstance();
  express.get('/', (req, res) => {
    res.status(200).send('OK');
  });

  const tcpPort = parseInt(process.env.CORE_PORT || '3003', 10);
  const httpPort = parseInt(process.env.PORT || '4003', 10);


  // Attach microservice (TCP)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.CORE_HOST || 'localhost',
      port: tcpPort,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `Core microservice is running on HTTP port ${httpPort} and TCP port ${tcpPort}`,
  );
}
bootstrap();
