import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { AllExceptionsFilter } from './common/exception.filters/all.exceptions.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const express = app.getHttpAdapter().getInstance();
  express.get('/', (req, res) => {
    res.status(200).send('OK');
  });

  const grpcPort = parseInt(process.env.PAYMENT_PORT || '3002', 10);
  const httpPort = parseInt(process.env.PORT || '4002', 10);
  const grpcHost = process.env.PAYMENT_HOST || '0.0.0.0';

  const grpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'payment',
      protoPath: [join(process.cwd(), 'proto/payment.proto')],
      url: `${grpcHost}:${grpcPort}`,
      loader: {
        keepCase: true,
      },
    },
  };

  app.connectMicroservice<MicroserviceOptions>(grpcOptions, {
    inheritAppConfig: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `Payment microservice is running on HTTP port ${httpPort} with gRPC endpoint ${grpcHost}:${grpcPort}`,
  );
}
bootstrap();
