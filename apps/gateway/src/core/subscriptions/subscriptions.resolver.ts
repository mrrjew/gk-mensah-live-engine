import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateSubscriptionInput,
  Subscription,
} from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { StringResponse } from '../users/dto/update-user.input';
import { ResponseService } from '../../common/utils/response';
import {
  Empty,
  GenericResponse,
  SubscriptionDto,
  SubscriptionList,
  SubscriptionsGrpcService,
} from '../../grpc/core-grpc.types';

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  private subscriptionsService?: SubscriptionsGrpcService;

  constructor(
    @Inject('CORE_SERVICE') private readonly coreClient: ClientGrpc,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  private get service(): SubscriptionsGrpcService {
    if (!this.subscriptionsService) {
      this.subscriptionsService = this.coreClient.getService<SubscriptionsGrpcService>(
        'SubscriptionsService',
      );
    }
    return this.subscriptionsService;
  }

  @Query(() => [Subscription])
  async subscriptions() {
    const response = await this.responseService.sendRequest<SubscriptionList>(
      this.service.findAll({} as Empty),
    );
    return (response.items ?? []) as Subscription[];
  }

  @Query(() => Subscription)
  async subscription(@Args('id', { type: () => String }) id: string) {
    return this.responseService.sendRequest<SubscriptionDto>(
      this.service.findOne({ id }),
    );
  }

  @Mutation(() => Subscription)
  async createSubscription(@Args('input') input: CreateSubscriptionInput) {
    return this.responseService.sendRequest<SubscriptionDto>(
      this.service.create(input),
    );
  }

  @Mutation(() => StringResponse)
  async updateSubscription(@Args('input') input: UpdateSubscriptionInput) {
    const response = await this.responseService.sendRequest<GenericResponse>(
      this.service.update(input as any),
    );
    return { message: response.message };
  }

  @Mutation(() => StringResponse)
  async removeSubscription(@Args('id', { type: () => String }) id: string) {
    const response = await this.responseService.sendRequest<GenericResponse>(
      this.service.remove({ id }),
    );
    return { message: response.message };
  }
}
