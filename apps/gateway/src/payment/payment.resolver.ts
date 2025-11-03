import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PaymentResponse, VerifyResponse } from './dto/payyment-response.dto';
import { CreatePaymentInput, Payment } from './dto/create-payment.dto';
import { CurrentUser } from '../core/common/decorators/current-user.decorator';

@Resolver()
export class PaymentResolver {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
  ) {}

  // 🔹 Mutation: Initialize a Paystack payment
  @Mutation(() => PaymentResponse)
  async initializePayment(
    @CurrentUser() user: any,
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ): Promise<PaymentResponse> {
    try {
      const payload = {
        ...createPaymentInput,
        email: user.email,
        signedUserId:user.sub
      };    

      console.log('Payload in Resolver:', payload);
      const response = await lastValueFrom(
        this.paymentClient.send({ cmd: 'initialize_payment' },payload ),
      );

      return response;
    } catch (err) {
      throw new Error(`Failed to initialize payment: ${err.message}`);
    }
  }

  // 🔹 Query: Verify payment by reference
  @Query(() => VerifyResponse)
  async verifyPayment(
    @Args('reference', { type: () => String }) reference: string,
  ): Promise<VerifyResponse> {
    try {
      const response = await lastValueFrom(
        this.paymentClient.send({ cmd: 'verify_payment' }, reference),
      );
      return response;
    } catch (err) {
      throw new Error(`Payment verification failed: ${err.message}`);
    }
  }

  @Query(() => Payment)
  async payment(
    @Args('paymentId', { type: () => String }) paymentId: string,
  ): Promise<Payment> {
    try {
      const response = await lastValueFrom(
        this.paymentClient.send({ cmd: 'get_payment' }, paymentId),
      );
      return response;
    } catch (err) {
      throw new Error(`Failed to get payment: ${err.message}`);
    }
  }

  @Query(() => [Payment])
  async payments(): Promise<Payment> {
    try {
      const response = await lastValueFrom(
        this.paymentClient.send({ cmd: 'get_payments' }, {}),
      );
      console.log('Payments response:', response);
      return response;
    } catch (err) {
      throw new Error(`Failed to get payment: ${err.message}`);
    }
  }

  @Query(() => [Payment])
  async paymentsByUser(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<Payment[]> {
    try {
      const response = await lastValueFrom(
        this.paymentClient.send({ cmd: 'get_payments_by_user' }, userId),
      );
      return response;
    } catch (err) {
      throw new Error(`Failed to get payments by user: ${err.message}`);
    }
  }

  @Query(() => String)
  async pingPayments() : Promise<String> {
    try {
      const response = await lastValueFrom(
        this.paymentClient.send('pingPayments', {}),
      );
      return response;
    } catch (err) {
      throw new Error(`Ping failed: ${err.message}`);
    }
  }

}
