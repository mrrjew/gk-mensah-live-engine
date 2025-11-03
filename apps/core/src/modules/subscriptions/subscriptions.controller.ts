import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {
    console.log('✅ SubscriptionsController initialized');
  }

  @MessagePattern('pingSubscriptions')
  async pingSubscriptions() {
    return 'Subscriptions service is live 🚀';
  }

  @MessagePattern({ service: 'subscriptions', cmd: 'create' })
  async create(data: CreateSubscriptionDto) {
    try {
      if (!data?.name) throw new RpcException('Missing subscription name');
      return await this.subscriptionsService.create(data);
    } catch (err) {
      console.error('❌ Error creating subscription:', err);
      throw new RpcException(err?.message || 'Internal server error');
    }
  }

  @MessagePattern({ service: 'subscriptions', cmd: 'findAll' })
  async findAll() {
    return this.subscriptionsService.findAll();
  }

  @MessagePattern({ service: 'subscriptions', cmd: 'findOne' })
  async findOne(data: { id: string }) {
    if (!data?.id) throw new RpcException('Missing ID');
    return this.subscriptionsService.findOne(data.id);
  }

  @MessagePattern({ service: 'subscriptions', cmd: 'update' })
  async update(data: UpdateSubscriptionDto) {
    if (!data?.id) throw new RpcException('Missing subscription ID');
    return this.subscriptionsService.update(data.id, data);
  }

  @MessagePattern({ service: 'subscriptions', cmd: 'remove' })
  async remove(data: { id: string }) {
    if (!data?.id) throw new RpcException('Missing ID');
    return this.subscriptionsService.remove(data.id);
  }
}
