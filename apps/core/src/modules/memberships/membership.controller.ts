import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Controller()
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {
    console.log(' MembershipsController initialized');
  }

  @MessagePattern('pingMemberships')
  async ping() {
    return 'Memberships service is active ';
  }

  @MessagePattern({ service: 'memberships', cmd: 'create' })
  async create(createMembershipDto: CreateMembershipDto) {
    try {
      console.log('Received createMembershipDto:', createMembershipDto);
      return await this.membershipsService.create(createMembershipDto);
    } catch (err) {
      console.error('Error creating membership:', err);
      throw new RpcException(err?.message || 'Failed to create membership');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'findAll' })
  async findAll() {
    try {
      return await this.membershipsService.findAll();
    } catch (err) {
      console.error('Error fetching memberships:', err);
      throw new RpcException('Failed to fetch memberships');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'findOne' })
  async findOne(data: { id: string }) {
    try {
      if (!data?.id) throw new RpcException('Missing membership ID');
      return await this.membershipsService.findOne(data.id);
    } catch (err) {
      console.error('Error finding membership:', err);
      throw new RpcException(err?.message || 'Failed to fetch membership');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'findByUser' })
  async findByUser(data: { userId: string }) {
    try {
      if (!data?.userId) throw new RpcException('Missing user ID');
      return await this.membershipsService.findByUser(data.userId);
    } catch (err) {
      console.error('Error finding user memberships:', err);
      throw new RpcException(err?.message || 'Failed to fetch user memberships');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'findBySubscription' })
  async findBySubscription(data: { subscriptionId: string }) {
    try {
      if (!data?.subscriptionId) throw new RpcException('Missing subscription ID');
      return await this.membershipsService.findBySubscription(data.subscriptionId);
    } catch (err) {
      console.error('Error finding subscription memberships:', err);
      throw new RpcException(err?.message || 'Failed to fetch subscription memberships');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'findActiveByUser' })
  async findActiveByUser(data: { userId: string }) {
    try {
      if (!data?.userId) throw new RpcException('Missing user ID');
      return await this.membershipsService.findActiveByUser(data.userId);
    } catch (err) {
      console.error('Error finding active user memberships:', err);
      throw new RpcException(err?.message || 'Failed to fetch active user memberships');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'update' })
  async update(updateMembershipDto: UpdateMembershipDto & { id: string }) {
    try {
      if (!updateMembershipDto?.id) throw new RpcException('Missing membership ID');
      return await this.membershipsService.update(updateMembershipDto.id, updateMembershipDto);
    } catch (err) {
      console.error('Error updating membership:', err);
      throw new RpcException(err?.message || 'Failed to update membership');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'remove' })
  async remove(data: { id: string }) {
    try {
      if (!data?.id) throw new RpcException('Missing membership ID');
      return await this.membershipsService.remove(data.id);
    } catch (err) {
      console.error('Error removing membership:', err);
      throw new RpcException(err?.message || 'Failed to remove membership');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'deactivateExpired' })
  async deactivateExpired() {
    try {
      return await this.membershipsService.deactivateExpiredMemberships();
    } catch (err) {
      console.error('Error deactivating expired memberships:', err);
      throw new RpcException('Failed to deactivate expired memberships');
    }
  }
}
