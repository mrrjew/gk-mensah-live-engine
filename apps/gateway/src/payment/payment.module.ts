import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';

@Module({
    imports: [],
    controllers: [],
    providers: [PaymentResolver],
})
export class PaymentModule {}
