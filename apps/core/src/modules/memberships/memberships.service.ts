import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Memberships } from './entities/memberships.entities';
import { eq, and, lte } from 'drizzle-orm';
import { DrizzleService } from '@app/lib/core/drizzle';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subscriptions } from '../subscriptions/entities/subscriptions';

@Injectable()
export class MembershipsService {
  private readonly logger = new Logger(MembershipsService.name);

  constructor(private readonly drizzleService: DrizzleService) {}
  async create(createMembershipDto: CreateMembershipDto) {
    const subscription = await this.drizzleService.db
      .select()
      .from(Subscriptions)
      .where(eq(Subscriptions.id, createMembershipDto.subscriptionId));

    if (!subscription.length) {
      throw new NotFoundException('Subscription not found');
    }

    const now = new Date();

    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + subscription[0].durationDays);

    const existingActiveMembership = await this.findActiveByUser(
      createMembershipDto.userId,
    );

    if (existingActiveMembership) {
      throw new BadRequestException('User already has an active membership');
    }

    const membership = await this.drizzleService.db
      .insert(Memberships)
      .values({
        ...createMembershipDto,
        startDate: now,
        endDate, // use computed endDate
      })
      .returning();

    console.log('Created membership:', membership);
    return membership[0];
  }

  async findAll() {
    return await this.drizzleService.db.select().from(Memberships);
  }

  async findOne(id: string) {
    const membership = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(eq(Memberships.id, id));

    if (!membership.length) throw new NotFoundException('Membership not found');
    return membership[0];
  }

  async findByUser(userId: string) {
    const membership = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(eq(Memberships.userId, userId));
    return membership;
  }

  async findBySubscription(subscriptionId: string) {
    const memberships = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(eq(Memberships.subscriptionId, subscriptionId));
    return memberships;
  }

  async findActiveByUser(userId: string) {
    const membership = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(
        and(eq(Memberships.userId, userId), eq(Memberships.isActive, true)),
      );
    console.log('Active membership for user:', membership);
    return membership[0];
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto) {
    const updated = await this.drizzleService.db
      .update(Memberships)
      .set({ ...updateMembershipDto })
      .where(eq(Memberships.id, id))
      .returning();
    if (!updated.length) throw new NotFoundException('Membership not found');
    return updated[0];
  }

  async remove(id: string) {
    const [membership] = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(eq(Memberships.id, id));

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    await this.drizzleService.db
      .update(Memberships)
      .set({
        isActive: false,
        endDate: new Date(),
      })
      .where(eq(Memberships.id, id));

    return { success: true, message: 'Membership cancelled successfully' };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deactivateExpiredMemberships() {
    const now = new Date();

    this.logger.log(
      `Checking for expired memberships as of ${now.toISOString()}...`,
    );

    const result = await this.drizzleService.db
      .update(Memberships)
      .set({ isActive: false })
      .where(
        and(lte(Memberships.endDate, now), eq(Memberships.isActive, true)),
      );

    const affected =
      (result as unknown as { rowCount?: number })?.rowCount ?? 0;
    this.logger.log(`Deactivated ${affected} expired memberships.`);
    return {
      success: true,
      message: `Deactivated ${affected} expired memberships`,
    };
  }
}
