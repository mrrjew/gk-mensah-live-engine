import {
  Controller,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import * as uuid from 'uuid';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DrizzleService } from '@app/lib/core/drizzle';
import { Memberships } from 'apps/core/src/modules/memberships/entities/memberships.entities';
import { eq } from 'drizzle-orm';
import { Subscriptions } from 'apps/core/src/modules/subscriptions/entities/subscriptions';
import { Payments } from './entities';
import { MessagePattern } from '@nestjs/microservices';

@Controller('payment')
@ApiTags('Payment Endpoint')
export class PaymentController {
  private reference = uuid.v4();
  private readonly PAYSTACK_BASE_URL = 'https://api.paystack.co';
  private readonly PAYSTACK_SECRET_KEY: string;

  constructor(
    private drizzleService: DrizzleService,
    protected configService: ConfigService,
  ) {
    this.PAYSTACK_SECRET_KEY =
      this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  @MessagePattern('pingPayments')
  async ping() {
    return 'Payment service is active';
  }

  @MessagePattern({ cmd: 'initialize_payment' })
  @ApiResponse({
    example: {
      authorization_url: 'https://checkout.paystack.com/kmwk9zms4qb4kaj',
      access_code: 'kmwk9zms4qb4kaj',
      reference: 'fcff7f8d-bb60-4854-8c89-0555883db81e',
    },
  })
  async initializePayment(createPaymentDto: any) {
    try {
      const {
        email,
        signedUserId: userId,
        membershipId,
        method,
        paymentDate,
        callback_url,
      } = createPaymentDto;

      const membership = await this.drizzleService.db
        .select()
        .from(Memberships)
        .where(eq(Memberships.id, membershipId));

      if (!membership.length) {
        throw new BadRequestException('Membership does not exist');
      }

      const subscription = await this.drizzleService.db
        .select()
        .from(Subscriptions)
        .where(eq(Subscriptions.id, membership[0].subscriptionId));

      if (!subscription.length) {
        throw new BadRequestException('Subscription not found');
      }

      const payment = await this.drizzleService.db
        .insert(Payments)
        .values({
          email,
          userId,
          membershipId,
          paymentDate,
          amount: String(subscription[0].price),
          status: 'PENDING',
          method,
        })
        .returning({ id: Payments.id });

      const data = {
        email,
        amount: String(subscription[0].price * 100),
        reference: this.reference,
        metadata: {
          membershipId,
          paymentId: payment[0].id,
        },
        callback_url,
        currency: 'GHS',
        channels: [method],
      };

      console.log('Initialization Data:', data);

      const response = await axios.post(
        `${this.PAYSTACK_BASE_URL}/transaction/initialize`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Paystack Response:', response.data);

      if (!response.data.status) {
        throw new BadRequestException(response.data.message);
      }

      return response.data.data;
    } catch (err) {
      console.error('Initialize Payment Error:', err.response?.data || err);
      throw new InternalServerErrorException(
        err.response?.data?.message || err.message,
      );
    }
  }

  @MessagePattern({ cmd: 'verify_payment' })
  async verify(reference: string) {
    try {
      const response = await axios.get(
        `${this.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
          },
        },
      );

      const data = response.data.data;

      if (data.status === 'success') {
        const membership = await this.drizzleService.db
          .select()
          .from(Memberships)
          .where(eq(Memberships.id, parseInt(data.metadata.membershipId)));

        if (!membership.length) {
          throw new BadRequestException('Membership does not exist');
        }

        await this.drizzleService.db
          .update(Memberships)
          .set({
            paymentReference: reference,
            isActive: true,
          })
          .where(eq(Memberships.id, parseInt(data.metadata.membershipId)));

        await this.drizzleService.db
          .update(Payments)
          .set({
            status: 'APPROVED',
          })
          .where(eq(Payments.id, parseInt(data.metadata.paymentId)));

        return { message: 'Payment verified successfully' };
      } else {
        throw new BadRequestException('Payment verification failed');
      }
    } catch (err) {
      console.error('Verify Payment Error:', err.response?.data || err);
      throw new InternalServerErrorException(
        err.response?.data?.message || err.message,
      );
    }
  }
}
