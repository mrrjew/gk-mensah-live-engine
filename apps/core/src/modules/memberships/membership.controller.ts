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
  async findOne(data: { id: number }) {
    try {
      if (!data?.id) throw new RpcException('Missing membership ID');
      return await this.membershipsService.findOne(data.id);
    } catch (err) {
      console.error('Error finding membership:', err);
      throw new RpcException(err?.message || 'Failed to fetch membership');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'findByUser' })
  async findByUser(data: { userId: number }) {
    try {
      if (!data?.userId) throw new RpcException('Missing user ID');
      return await this.membershipsService.findByUser(data.userId);
    } catch (err) {
      console.error('Error finding user memberships:', err);
      throw new RpcException(err?.message || 'Failed to fetch user memberships');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'update' })
  async update(updateMembershipDto: UpdateMembershipDto & { id: number }) {
    try {
      if (!updateMembershipDto?.id) throw new RpcException('Missing membership ID');
      return await this.membershipsService.update(updateMembershipDto.id, updateMembershipDto);
    } catch (err) {
      console.error('Error updating membership:', err);
      throw new RpcException(err?.message || 'Failed to update membership');
    }
  }

  @MessagePattern({ service: 'memberships', cmd: 'remove' })
  async remove(data: { id: number }) {
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
