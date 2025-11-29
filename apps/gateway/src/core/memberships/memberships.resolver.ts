import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateMembershipInput,
  Membership,
  MembershipResponse,
} from './dto/create-membership.input';
import { UpdateMembershipInput } from './dto/update-membership.input';
import { ResponseService } from '../../common/utils/response';
import {
  Empty,
  GenericResponse,
  MembershipList,
  MembershipsGrpcService,
} from '../../grpc/core-grpc.types';

@Resolver(() => Membership)
export class MembershipsResolver implements OnModuleInit {
  private membershipsService: MembershipsGrpcService;

  constructor(
    @Inject('CORE_SERVICE') private readonly coreClient: ClientGrpc,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  onModuleInit() {
    this.membershipsService =
      this.coreClient.getService<MembershipsGrpcService>('MembershipsService');
  }

  @Query(() => [Membership])
  async memberships() {
    const response = await this.responseService.sendRequest<MembershipList>(
      this.membershipsService.findAll({} as Empty),
    );
    return response.items ?? [];
  }

  @Query(() => Membership)
  async membership(@Args('id', { type: () => String }) id: string) {
    return this.responseService.sendRequest<Membership>(
      this.membershipsService.findOne({ id }),
    );
  }

  @Query(() => [Membership])
  async membershipsBySubscription(
    @Args('subscriptionId', { type: () => String }) subscriptionId: string,
  ) {
    const response = await this.responseService.sendRequest<MembershipList>(
      this.membershipsService.findBySubscription({ subscriptionId }),
    );
    return response.items ?? [];
  }

  @Query(() => [Membership])
  async membershipsByUser(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    const response = await this.responseService.sendRequest<MembershipList>(
      this.membershipsService.findByUser({ userId }),
    );
    return response.items ?? [];
  }

  @Query(() => Membership)
  async activeMembershipByUser(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return this.responseService.sendRequest<Membership>(
      this.membershipsService.findActiveByUser({ userId }),
    );
  }

  @Mutation(() => Membership)
  async createMembership(@Args('input') input: CreateMembershipInput) {
    console.log('Creating membership with input:', input);
    return this.responseService.sendRequest<Membership>(
      this.membershipsService.create(input as any),
    );
  }
  
  @Mutation(() => Membership)
  async updateMembership(@Args('input') input: UpdateMembershipInput) {
    console.log('Updating membership with input:', input);
    return this.responseService.sendRequest<Membership>(
      this.membershipsService.update(input as any),
    );
  }

  @Mutation(() => MembershipResponse)
  async removeMembership(@Args('id', { type: () => String }) id: string) {
    const response = await this.responseService.sendRequest<GenericResponse>(
      this.membershipsService.remove({ id }),
    );
    return {
      success: response.success ?? true,
      message: response.message ?? 'Membership deleted successfully',
    };
  }

  @Query(() => String)
  async deactivateExpiredMemberships() {
    const response = await this.responseService.sendRequest<GenericResponse>(
      this.membershipsService.deactivateExpired({} as Empty),
    );
    return response.message;
  }
}
