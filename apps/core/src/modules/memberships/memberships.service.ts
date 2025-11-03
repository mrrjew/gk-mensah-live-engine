import { Injectable,Logger, NotFoundException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Memberships } from './entities/memberships.entities';
import { eq,and,lte } from 'drizzle-orm';
import { DrizzleService } from '@app/lib/core/drizzle';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MembershipsService {
private readonly logger = new Logger(MembershipsService.name);

constructor(private readonly drizzleService: DrizzleService) {}
  async create(createMembershipDto: CreateMembershipDto) {
    console.log('Creating membership with DTO:', createMembershipDto);
    const membership = await this.drizzleService.db
      .insert(Memberships)
      .values({...createMembershipDto,
        startDate: new Date(createMembershipDto.startDate ?? ''),
        endDate: new Date(createMembershipDto.endDate ?? ''),
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
    const membership = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(eq(Memberships.subscriptionId, subscriptionId));
    return membership;
  }

  async findActiveByUser(userId: string) {
    const membership = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(and(eq(Memberships.userId, userId),eq(Memberships.isActive, true)))
    return membership;
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto) {
    const updated = await this.drizzleService.db
      .update(Memberships)
      .set({...updateMembershipDto,
        startDate: new Date(updateMembershipDto.startDate ?? ''),
        endDate: new Date(updateMembershipDto.endDate ?? ''),
      })
      .where(eq(Memberships.id, id))
      .returning();
    if (!updated.length) throw new NotFoundException('Membership not found');
    return updated[0];
  }

  async remove(id: string) {
    const deleted = await this.drizzleService.db
      .delete(Memberships)
      .where(eq(Memberships.id, id))
      .returning();
    if (!deleted.length) throw new NotFoundException('Membership not found');
    return { message: 'Membership deleted successfully' };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deactivateExpiredMemberships() {
    const now = new Date();

    this.logger.log(`Checking for expired memberships as of ${now.toISOString()}...`);

    const result = await this.drizzleService.db
      .update(Memberships)
      .set({ isActive: false })
      .where(
        and(
          lte(Memberships.endDate, now),
          eq(Memberships.isActive, true)
        )
      );

    this.logger.log(`Deactivated ${result.rowCount ?? 0} expired memberships.`);
  }
}
