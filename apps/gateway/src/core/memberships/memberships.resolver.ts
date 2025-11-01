import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateMembershipInput,Membership } from './dto/create-membership.input';
import { UpdateMembershipInput } from './dto/update-membership.input';

@Resolver(() => Membership)
export class MembershipsResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreClient: ClientProxy) {}

  @Query(() => [Membership])
  async memberships() {
    return await lastValueFrom(
      this.coreClient.send({ service: 'memberships', cmd: 'findAll' }, {}),
    );
  }

  @Query(() => Membership)
  async membership(@Args('id', { type: () => Int }) id: number) {
    return await lastValueFrom(
      this.coreClient.send({ service: 'memberships', cmd: 'findOne' }, { id }),
    );
  }

  @Query(() => [Membership])
  async membershipsByUser(@Args('userId', { type: () => Int }) userId: number) {
    return await lastValueFrom(
      this.coreClient.send({ service: 'memberships', cmd: 'findByUser' }, { userId }),
    );
  }

  @Mutation(() => Membership)
  async createMembership(@Args('input') input: CreateMembershipInput) {
    // Optionally auto-calc endDate based on subscription duration
    const membership = await lastValueFrom(
      this.coreClient.send({ service: 'memberships', cmd: 'create' }, input),
    );
    return membership;
  }

  @Mutation(() => Membership)
  async updateMembership(
    @Args('input') input: UpdateMembershipInput,
  ) {
    return await lastValueFrom(
      this.coreClient.send({ service: 'memberships', cmd: 'update' }, input),
    );
  }

  @Mutation(() => Boolean)
  async removeMembership(@Args('id', { type: () => Int }) id: number) {
    return await lastValueFrom(
      this.coreClient.send({ service: 'memberships', cmd: 'remove' }, { id }),
    );
  }
}
