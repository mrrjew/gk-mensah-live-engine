import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PaymentResponse, VerifyResponse } from './dto/payment-response.dto';
import { CreatePaymentInput, Payment } from './dto/create-payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseService } from '../common/utils/response';
import {
  Empty,
  PaymentGrpcService,
  PaymentInitRequest,
  PaymentsList,
} from '../grpc/payment-grpc.types';

@Resolver(() => Payment)
export class PaymentResolver implements OnModuleInit {
  private paymentService: PaymentGrpcService;

  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientGrpc,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentClient.getService<PaymentGrpcService>('PaymentService');
  }

  @Mutation(() => PaymentResponse)
  async initializePayment(
    @CurrentUser() user: any,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ) {
    const payload = {
      ...createPaymentInput,
      email: user.email,
      userId: user.sub,
    };

    const response = await this.responseService.sendRequest<PaymentResponse>(
      this.paymentService.initializePayment(payload as PaymentInitRequest),
    );

    console.log('initializePayment response:', response);

    return response;
  }

  @Query(() => VerifyResponse)
  async verifyPayment(
    @Args('reference', { type: () => String }) reference: string,
  ) {
    return this.responseService.sendRequest<VerifyResponse>(
      this.paymentService.verifyPayment({ reference }),
    );
  }

  @Query(() => Payment)
  async payment(@Args('paymentId', { type: () => String }) paymentId: string) {
    const response = await this.responseService.sendRequest<Payment>(
      this.paymentService.getPayment({ paymentId }),
    );
    return this.toGraphqlPayment(response);
  }

  @Query(() => [Payment])
  async payments() {
    const response = await this.responseService.sendRequest<PaymentsList>(
      this.paymentService.getPayments({} as Empty),
    );
    return (response.items ?? []).map((payment) =>
      this.toGraphqlPayment(payment as unknown as Payment),
    );
  }

  @Query(() => [Payment])
  async paymentsByUser(@Args('userId', { type: () => String }) userId: string) {
    const response = await this.responseService.sendRequest<PaymentsList>(
      this.paymentService.getPaymentsByUser({ userId }),
    );
    return (response.items ?? []).map((payment) =>
      this.toGraphqlPayment(payment as unknown as Payment),
    );
  }

  @Query(() => String)
  async pingPayments() {
    const response = await this.responseService.sendRequest<{
      message?: string;
    }>(this.paymentService.ping({} as Empty));
    return response.message;
  }

  private toGraphqlPayment(payment?: Partial<Payment> | null): Payment {
    if (!payment) {
      throw new Error('Payment payload missing');
    }

    const normalized: Record<string, any> = { ...payment };
    if (normalized.paymentDate) {
      normalized.paymentDate = new Date(normalized.paymentDate);
    }

    return normalized as Payment;
  }
}
