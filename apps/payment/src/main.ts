import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentModule,{
    transport: 'TCP',
    options: {
      port: process.env.PAYMENT_PORT || 3002,
    },
  });

  console.log(`Payment microservice is running on port ${process.env.PAYMENT_PORT || 3002}`);

  console.log('📡 Registered message handlers:', app['messageHandlers']);

  await app.listen();
}
bootstrap();
