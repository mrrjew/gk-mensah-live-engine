import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { AllExceptionsFilter } from './common/exception.filters/all.exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentModule,{
    transport: 'TCP',
    options: {
      port: process.env.PAYMENT_PORT || 3002,
    },
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  console.log(`Payment microservice is running on port ${process.env.PAYMENT_PORT || 3002}`);

  console.log('📡 Registered message handlers:', app['messageHandlers']);

  await app.listen();
}
bootstrap();
