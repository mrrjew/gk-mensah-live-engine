import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exception.filters/all.exceptions.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);
  const express = app.getHttpAdapter().getInstance();
  express.get('/', (req, res) => {
    res.status(200).send('OK');
  });

  const grpcPort = parseInt(process.env.CORE_PORT || '3003', 10);
  const httpPort = parseInt(process.env.PORT || '4003', 10);

  const grpcHost = process.env.CORE_HOST || '0.0.0.0';

  const grpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'core',
      protoPath: [join(process.cwd(), 'proto/core.proto')],
      url: `${grpcHost}:${grpcPort}`,
    },
  };

  app.connectMicroservice<MicroserviceOptions>(grpcOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `Core microservice is running on HTTP port ${httpPort} with gRPC endpoint ${grpcHost}:${grpcPort}`,
  );
}
bootstrap();
