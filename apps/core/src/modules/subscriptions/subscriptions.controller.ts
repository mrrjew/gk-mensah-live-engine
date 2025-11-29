import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {
    console.log('✅ SubscriptionsController initialized');
  }

  @GrpcMethod('SubscriptionsService', 'Ping')
  async pingSubscriptions() {
    return { message: 'Subscriptions service is live 🚀' };
  }

  @GrpcMethod('SubscriptionsService', 'Create')
  async create(data: CreateSubscriptionDto) {
    try {
      if (!data?.name) throw new RpcException('Missing subscription name');
      return await this.subscriptionsService.create(data);
    } catch (err) {
      console.error('❌ Error creating subscription:', err);
      throw new RpcException(err?.message || 'Internal server error');
    }
  }

  @GrpcMethod('SubscriptionsService', 'FindAll')
  async findAll() {
    const subscriptions = await this.subscriptionsService.findAll();
    return { items: subscriptions };
  }

  @GrpcMethod('SubscriptionsService', 'FindOne')
  async findOne(data: { id: string }) {
    if (!data?.id) throw new RpcException('Missing ID');
    return this.subscriptionsService.findOne(data.id);
  }

  @GrpcMethod('SubscriptionsService', 'Update')
  async update(data: UpdateSubscriptionDto) {
    if (!data?.id) throw new RpcException('Missing subscription ID');
    const message = await this.subscriptionsService.update(data.id, data);
    return { success: true, message: message.message };
  }

  @GrpcMethod('SubscriptionsService', 'Remove')
  async remove(data: { id: string }) {
    if (!data?.id) throw new RpcException('Missing ID');
    const message = await this.subscriptionsService.remove(data.id);
    return { success: true, message: message.message };
  }
}
