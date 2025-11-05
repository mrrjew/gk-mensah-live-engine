import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { ResponseService } from '../common/utils/response';

@Module({
    imports: [],
    controllers: [],
    providers: [PaymentResolver,{
        provide: 'RESPONSE',
        useClass: ResponseService,
      },],
})
export class PaymentModule {}
