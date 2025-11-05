import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMembershipInput, Membership } from './dto/create-membership.input';
import { UpdateMembershipInput } from './dto/update-membership.input';
import { ResponseService } from '../../common/utils/response';

@Resolver(() => Membership)
export class MembershipsResolver {
  constructor(
    @Inject('CORE_SERVICE') private readonly coreClient: ClientProxy,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  @Query(() => [Membership])
  async memberships() {
    return this.responseService.sendRequest<Membership[]>(
      { service: 'memberships', cmd: 'findAll' },
      {},
      this.coreClient,
    );
  }

  @Query(() => Membership)
  async membership(@Args('id', { type: () => String }) id: string) {
    return this.responseService.sendRequest<Membership>(
      { service: 'memberships', cmd: 'findOne' },
      { id },
      this.coreClient,
    );
  }

  @Query(() => [Membership])
  async membershipsBySubscription(
    @Args('subscriptionId', { type: () => String }) subscriptionId: string,
  ) {
    return this.responseService.sendRequest<Membership[]>(
      { service: 'memberships', cmd: 'findBySubscription' },
      { subscriptionId },
      this.coreClient,
    );
  }

  @Query(() => [Membership])
  async membershipsByUser(@Args('userId', { type: () => String }) userId: string) {
    return this.responseService.sendRequest<Membership[]>(
      { service: 'memberships', cmd: 'findByUser' },
      { userId },
      this.coreClient,
    );
  }

  @Query(() => Membership)
  async activeMembershipByUser(@Args('userId', { type: () => String }) userId: string) {
    return this.responseService.sendRequest<Membership[]>(
      { service: 'memberships', cmd: 'findActiveByUser' },
      { userId },
      this.coreClient,
    );
  }

  @Mutation(() => Membership)
  async createMembership(@Args('input') input: CreateMembershipInput) {
    console.log('Creating membership with input:', input);
    return this.responseService.sendRequest<Membership>(
      { service: 'memberships', cmd: 'create' },
      input,
      this.coreClient,
    );
  }

  @Mutation(() => Membership)
  async updateMembership(@Args('input') input: UpdateMembershipInput) {
    return this.responseService.sendRequest<Membership>(
      { service: 'memberships', cmd: 'update' },
      input,
      this.coreClient,
    );
  }

  @Mutation(() => Boolean)
  async removeMembership(@Args('id', { type: () => String }) id: string) {
    return this.responseService.sendRequest<Membership>(
      { service: 'memberships', cmd: 'remove' },
      { id },
      this.coreClient,
    );
  }

  @Query(() => String)
  async deactivateExpiredMemberships() {
    return this.responseService.sendRequest<Membership>(
      { service: 'memberships', cmd: 'deactivateExpiredMemberships' },
      {},
      this.coreClient,
    );
  }
}
