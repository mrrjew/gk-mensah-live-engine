import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { AllExceptionsFilter } from './common/exception.filters/all.exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);

  const tcpPort = parseInt(process.env.PAYMENT_PORT || '3002', 10);
  const httpPort = parseInt(process.env.PORT || '4002', 10);


  // Attach microservice (TCP)
  app.connectMicroservice({
    transport: 'TCP',
    options: {
      port: tcpPort,
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `Payment microservice is running on HTTP port ${httpPort} and TCP port ${tcpPort}`,
  );
}
bootstrap();
