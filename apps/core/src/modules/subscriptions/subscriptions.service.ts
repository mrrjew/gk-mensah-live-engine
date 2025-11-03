import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DrizzleService } from '@app/lib/core/drizzle';
import { Subscriptions } from './entities/subscriptions';
import { eq } from 'drizzle-orm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(dto: CreateSubscriptionDto) {
    try {
      const [newSubscription] = await this.drizzleService.db
        .insert(Subscriptions)
        .values(dto)
        .returning();

      return newSubscription;
    } catch (error) {
      console.error('❌ create() error:', error);
      throw new RpcException('Failed to create subscription');
    }
  }

  async findAll() {
    try {
      return await this.drizzleService.db.select().from(Subscriptions);
    } catch (error) {
      throw new RpcException('Failed to fetch subscriptions');
    }
  }

  async findOne(id: string) {
    try {
      const [subscription] = await this.drizzleService.db
        .select()
        .from(Subscriptions)
        .where(eq(Subscriptions.id, id));

      if (!subscription) throw new RpcException('Subscription not found');
      return subscription;
    } catch (error) {
      throw new RpcException('Failed to fetch subscription');
    }
  }

  async update(id: string, dto: UpdateSubscriptionDto) {
    try {
      await this.drizzleService.db
        .update(Subscriptions)
        .set(dto)
        .where(eq(Subscriptions.id, id));

      return { message: `Subscription ${id} updated successfully` };
    } catch (error) {
      throw new RpcException('Failed to update subscription');
    }
  }

  async remove(id: string) {
    try {
      await this.drizzleService.db
        .delete(Subscriptions)
        .where(eq(Subscriptions.id, id));
      return { message: `Subscription ${id} removed successfully` };
    } catch (error) {
      throw new RpcException('Failed to remove subscription');
    }
  }
}
