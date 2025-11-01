import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Memberships } from './entities/memberships.entities';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '@app/lib/core/drizzle';

@Injectable()
export class MembershipsService {
constructor(private readonly drizzleService: DrizzleService) {}
  async create(createMembershipDto: CreateMembershipDto) {
    const membership = await this.drizzleService.db
      .insert(Memberships)
      .values({...createMembershipDto,
        startDate: new Date(createMembershipDto.startDate ?? ''),
        endDate: new Date(createMembershipDto.endDate ?? ''),
      })
      .returning();
    return membership[0];
  }

  async findAll() {
    return await this.drizzleService.db.select().from(Memberships);
  }

  async findOne(id: number) {
    const membership = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(eq(Memberships.id, id));

    if (!membership.length) throw new NotFoundException('Membership not found');
    return membership[0];
  }

  async findByUser(userId: number) {
    const membership = await this.drizzleService.db
      .select()
      .from(Memberships)
      .where(eq(Memberships.userId, userId));
    return membership;
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto) {
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

  async remove(id: number) {
    const deleted = await this.drizzleService.db
      .delete(Memberships)
      .where(eq(Memberships.id, id))
      .returning();
    if (!deleted.length) throw new NotFoundException('Membership not found');
    return { message: 'Membership deleted successfully' };
  }

  async deactivateExpiredMemberships() {
    const now = new Date();
    await this.drizzleService.db
      .update(Memberships)
      .set({ isActive: false })
      .where(eq(Memberships.endDate, now));
  }
}
