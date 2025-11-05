import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubscriptionInput, Subscription } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { StringResponse } from '../users/dto/update-user.input';
import { ResponseService } from '../../common/utils/response';

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  constructor(
    @Inject('CORE_SERVICE') private readonly coreClient: ClientProxy,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  @Query(() => [Subscription])
  async subscriptions() {
    return this.responseService.sendRequest<Subscription[]>(
      { service: 'subscriptions', cmd: 'findAll' },
      {},
      this.coreClient,
    );
  }

  @Query(() => Subscription)
  async subscription(@Args('id', { type: () => String }) id: string) {
    return this.responseService.sendRequest<Subscription>(
      { service: 'subscriptions', cmd: 'findOne' },
      { id },
      this.coreClient,
    );
  }

  @Mutation(() => Subscription)
  async createSubscription(@Args('input') input: CreateSubscriptionInput) {
    return this.responseService.sendRequest<Subscription>(
      { service: 'subscriptions', cmd: 'create' },
      input,
      this.coreClient,
    );
  }

  @Mutation(() => StringResponse)
  async updateSubscription(@Args('input') input: UpdateSubscriptionInput) {
    return this.responseService.sendRequest<StringResponse>(
      { service: 'subscriptions', cmd: 'update' },
      input,
      this.coreClient,
    );
  }

  @Mutation(() => StringResponse)
  async removeSubscription(@Args('id', { type: () => String }) id: string) {
    return this.responseService.sendRequest<StringResponse>(
      { service: 'subscriptions', cmd: 'remove' },
      { id },
      this.coreClient,
    );
  }
}
