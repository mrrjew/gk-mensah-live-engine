import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentResponse, VerifyResponse } from './dto/payment-response.dto';
import { CreatePaymentInput, Payment } from './dto/create-payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ResponseService } from '../common/utils/response';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  @Mutation(() => PaymentResponse)
  async initializePayment(
    @CurrentUser() user: any,
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ) {
    const payload = {
      ...createPaymentInput,
      email: user.email,
      signedUserId: user.sub,
    };

    return this.responseService.sendRequest<PaymentResponse>(
      { cmd: 'initialize_payment' },
      payload,
      this.paymentClient,
    );
  }

  @Query(() => VerifyResponse)
  async verifyPayment(
    @Args('reference', { type: () => String }) reference: string,
  ) {
    return this.responseService.sendRequest<VerifyResponse>(
      { cmd: 'verify_payment' },
      reference,
      this.paymentClient,
    );
  }

  @Query(() => Payment)
  async payment(
    @Args('paymentId', { type: () => String }) paymentId: string,
  ) {
    return this.responseService.sendRequest<Payment>(
      { cmd: 'get_payment' },
      paymentId,
      this.paymentClient,
    );
  }

  @Query(() => [Payment])
  async payments() {
    return this.responseService.sendRequest<Payment[]>(
      { cmd: 'get_payments' },
      {},
      this.paymentClient,
    );
  }

  @Query(() => [Payment])
  async paymentsByUser(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return this.responseService.sendRequest<Payment[]>(
      { cmd: 'get_payments_by_user' },
      userId,
      this.paymentClient,
    );
  }

  @Query(() => String)
  async pingPayments() {
    return this.responseService.sendRequest<String>(
      'pingPayments',
      {},
      this.paymentClient,
    );
  }
}
