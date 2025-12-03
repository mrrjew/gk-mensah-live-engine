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

const normalizeSubscription = (dto: SubscriptionDto): Subscription => {
  const archivedAtValue = dto?.archivedAt
    ? new Date(dto.archivedAt as string)
    : null;
  return {
    ...(dto as Subscription),
    archivedAt: archivedAtValue,
  };
};

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  private subscriptionsService?: SubscriptionsGrpcService;

  constructor(
    @Inject('CORE_SERVICE') private readonly coreClient: ClientGrpc,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  private get service(): SubscriptionsGrpcService {
    if (!this.subscriptionsService) {
      this.subscriptionsService =
        this.coreClient.getService<SubscriptionsGrpcService>(
          'SubscriptionsService',
        );
    }
    return this.subscriptionsService;
  }

  @Query(() => [Subscription])
  async subscriptions(
    @Args('includeArchived', { type: () => Boolean, nullable: true })
    includeArchived?: boolean,
  ) {
    const response = await this.responseService.sendRequest<SubscriptionList>(
      this.service.findAll({} as Empty),
    );
    const items = (response.items ?? []).map((item) =>
      normalizeSubscription(item),
    );
    if (includeArchived) {
      return items;
    }
    return items.filter((item) => !item.isArchived);
  }

  @Query(() => Subscription)
  async subscription(@Args('id', { type: () => String }) id: string) {
    const dto = await this.responseService.sendRequest<SubscriptionDto>(
      this.service.findOne({ id }),
    );
    return normalizeSubscription(dto);
  }

  @Mutation(() => Subscription)
  async createSubscription(@Args('input') input: CreateSubscriptionInput) {
    const dto = await this.responseService.sendRequest<SubscriptionDto>(
      this.service.create(input),
    );
    return normalizeSubscription(dto);
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
