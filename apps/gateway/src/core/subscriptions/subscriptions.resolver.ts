import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateSubscriptionInput,Subscription } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { StringResponse } from '../users/dto/update-user.input';

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  @Query(() => [Subscription])
  async subscriptions() {
    return await lastValueFrom(
      this.coreClient.send({ service: 'subscriptions', cmd: 'findAll' }, {}),
    );
  }

  @Query(() => Subscription)
  async subscription(@Args('id', { type: () => Int }) id: number) {
    return await lastValueFrom(
      this.coreClient.send({ service: 'subscriptions', cmd: 'findOne' }, { id }),
    );
  }

  @Mutation(() => Subscription)
  async createSubscription(@Args('input') input: CreateSubscriptionInput) {
    return await lastValueFrom(
      this.coreClient.send({ service: 'subscriptions', cmd: 'create' }, input),
    );
  }

  @Mutation(() => StringResponse)
  async updateSubscription(
    @Args('input') input: UpdateSubscriptionInput,
  ) {
    return await lastValueFrom(
      this.coreClient.send({ service: 'subscriptions', cmd: 'update' }, input),
    );
  }

  @Mutation(() => StringResponse)
  async removeSubscription(@Args('id', { type: () => Int }) id: number) {
    return await lastValueFrom(
      this.coreClient.send({ service: 'subscriptions', cmd: 'remove' }, { id }),
    );
  }
}
