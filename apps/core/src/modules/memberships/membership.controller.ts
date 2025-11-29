import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Controller()
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {
    console.log(' MembershipsController initialized');
  }

  @GrpcMethod('MembershipsService', 'Ping')
  async ping() {
    return { message: 'Memberships service is active' };
  }

  @GrpcMethod('MembershipsService', 'Create')
  async create(createMembershipDto: CreateMembershipDto) {
    try {
      console.log('Received createMembershipDto:', createMembershipDto);
      return await this.membershipsService.create(createMembershipDto);
    } catch (err) {
      console.error('Error creating membership:', err);
      throw new RpcException(err?.message || 'Failed to create membership');
    }
  }

  @GrpcMethod('MembershipsService', 'FindAll')
  async findAll() {
    try {
      const memberships = await this.membershipsService.findAll();
      return { items: memberships };
    } catch (err) {
      console.error('Error fetching memberships:', err);
      throw new RpcException('Failed to fetch memberships');
    }
  }

  @GrpcMethod('MembershipsService', 'FindOne')
  async findOne(data: { id: string }) {
    try {
      if (!data?.id) throw new RpcException('Missing membership ID');
      return await this.membershipsService.findOne(data.id);
    } catch (err) {
      console.error('Error finding membership:', err);
      throw new RpcException(err?.message || 'Failed to fetch membership');
    }
  }

  @GrpcMethod('MembershipsService', 'FindByUser')
  async findByUser(data: { userId: string }) {
    try {
      if (!data?.userId) throw new RpcException('Missing user ID');
      const memberships = await this.membershipsService.findByUser(data.userId);
      return { items: memberships };
    } catch (err) {
      console.error('Error finding user memberships:', err);
      throw new RpcException(
        err?.message || 'Failed to fetch user memberships',
      );
    }
  }

  @GrpcMethod('MembershipsService', 'FindBySubscription')
  async findBySubscription(data: { subscriptionId: string }) {
    try {
      if (!data?.subscriptionId)
        throw new RpcException('Missing subscription ID');
      const memberships = await this.membershipsService.findBySubscription(
        data.subscriptionId,
      );
      return { items: memberships };
    } catch (err) {
      console.error('Error finding subscription memberships:', err);
      throw new RpcException(
        err?.message || 'Failed to fetch subscription memberships',
      );
    }
  }

  @GrpcMethod('MembershipsService', 'FindActiveByUser')
  async findActiveByUser(data: { userId: string }) {
    try {
      if (!data?.userId) throw new RpcException('Missing user ID');
      const membership = await this.membershipsService.findActiveByUser(
        data.userId,
      );
      if (!membership) {
        throw new RpcException('Active membership not found');
      }
      return membership;
    } catch (err) {
      console.error('Error finding active user memberships:', err);
      throw new RpcException(
        err?.message || 'Failed to fetch active user memberships',
      );
    }
  }

  @GrpcMethod('MembershipsService', 'Update')
  async update(updateMembershipDto: UpdateMembershipDto & { id: string }) {
    try {
      if (!updateMembershipDto?.id)
        throw new RpcException('Missing membership ID');
      return await this.membershipsService.update(
        updateMembershipDto.id,
        updateMembershipDto,
      );
    } catch (err) {
      console.error('Error updating membership:', err);
      throw new RpcException(err?.message || 'Failed to update membership');
    }
  }

  @GrpcMethod('MembershipsService', 'Remove')
  async remove(data: { id: string }) {
    try {
      if (!data?.id) throw new RpcException('Missing membership ID');
      return await this.membershipsService.remove(data.id);
    } catch (err) {
      console.error('Error removing membership:', err);
      throw new RpcException(err?.message || 'Failed to remove membership');
    }
  }

  @GrpcMethod('MembershipsService', 'DeactivateExpired')
  async deactivateExpired() {
    try {
      return await this.membershipsService.deactivateExpiredMemberships();
    } catch (err) {
      console.error('Error deactivating expired memberships:', err);
      throw new RpcException('Failed to deactivate expired memberships');
    }
  }
}
