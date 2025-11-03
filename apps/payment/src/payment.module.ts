import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { DrizzleModule } from '@app/lib/core/drizzle';

@Module({
  imports: [DrizzleModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
