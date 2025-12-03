import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DrizzleService } from '@app/lib/core/drizzle';
import { Subscriptions } from './entities/subscriptions';
import { Memberships } from '../memberships/entities/memberships.entities';
import { eq, sql } from 'drizzle-orm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  private async refreshMostPopularFlag() {
    try {
      const popularity = await this.drizzleService.db
        .select({
          subscriptionId: Memberships.subscriptionId,
          total: sql<number>`COUNT(${Memberships.id})`,
        })
        .from(Memberships)
        .where(eq(Memberships.isActive, true))
        .groupBy(Memberships.subscriptionId)
        .orderBy(sql`COUNT(${Memberships.id}) DESC`)
        .limit(1);

      const topSubscriptionId = popularity[0]?.subscriptionId;

      await this.drizzleService.db
        .update(Subscriptions)
        .set({ mostPopular: false });

      if (topSubscriptionId) {
        await this.drizzleService.db
          .update(Subscriptions)
          .set({ mostPopular: true })
          .where(eq(Subscriptions.id, topSubscriptionId));
      }
    } catch (error) {
      console.error('❌ refreshMostPopularFlag() error:', error);
    }
  }

  async create(dto: CreateSubscriptionDto) {
    try {
      const { isArchived, ...rest } = dto;
      const archivedFlag = Boolean(isArchived);
      const archivedAtValue = archivedFlag ? new Date() : null;
      const [newSubscription] = await this.drizzleService.db
        .insert(Subscriptions)
        .values({
          ...rest,
          isArchived: archivedFlag,
          archivedAt: archivedAtValue,
        })
        .returning();

      await this.refreshMostPopularFlag();
      return newSubscription;
    } catch (error) {
      console.error('❌ create() error:', error);
      throw new RpcException('Failed to create subscription');
    }
  }

  async findAll() {
    try {
      await this.refreshMostPopularFlag();
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
      const { id: _omit, isArchived, ...rest } = dto;
      const updatePayload = Object.fromEntries(
        Object.entries(rest).filter(([, value]) => value !== undefined),
      ) as Partial<typeof Subscriptions.$inferInsert>;

      if (isArchived !== undefined) {
        updatePayload.isArchived = isArchived;
        updatePayload.archivedAt = isArchived ? new Date() : null;
      }

      await this.drizzleService.db
        .update(Subscriptions)
        .set(updatePayload)
        .where(eq(Subscriptions.id, id));

      await this.refreshMostPopularFlag();
      return {
        success: true,
        message: `Subscription ${id} updated successfully`,
      };
    } catch (error) {
      throw new RpcException('Failed to update subscription');
    }
  }

  async remove(id: string) {
    try {
      const [subscription] = await this.drizzleService.db
        .select()
        .from(Subscriptions)
        .where(eq(Subscriptions.id, id));

      if (!subscription) {
        throw new RpcException('Subscription not found');
      }

      if (subscription.isArchived) {
        return {
          success: true,
          message: `Subscription ${id} is already archived`,
        };
      }

      await this.drizzleService.db
        .update(Subscriptions)
        .set({ isArchived: true, archivedAt: new Date() })
        .where(eq(Subscriptions.id, id));
      await this.refreshMostPopularFlag();
      return {
        success: true,
        message: `Subscription ${id} archived successfully`,
      };
    } catch (error) {
      console.error('❌ remove() error:', error);
      throw new RpcException('Failed to archive subscription');
    }
  }
}
