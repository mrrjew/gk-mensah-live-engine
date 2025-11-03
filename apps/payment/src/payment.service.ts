import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@app/lib/core/drizzle';
import { Payments, UpdatePaymentDto } from './entities'
import { eq } from 'drizzle-orm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createPaymentDto: any) {
    try {
      const result = await this.drizzleService.db.insert(Payments).values(createPaymentDto).returning();
      return result;
    }
    catch (error) {
      throw new RpcException('Failed to create payment');
    }   
  }

  async findAll() {
    try {
      const payments = await this.drizzleService.db.select().from(Payments);
      return payments;
    } catch (error) {
      throw new RpcException('Failed to fetch payments');
    }
  }

  async findOne(id: string) {
    try {
      const [payment] = await this.drizzleService.db
        .select()
        .from(Payments)
        .where(eq(Payments.id, id));
      if (!payment) throw new RpcException('Payment not found');
      return payment;
    } catch (error) {
      throw new RpcException('Failed to fetch payment');
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      await this.drizzleService.db
        .update(Payments)
        .set(updatePaymentDto)
        .where(eq(Payments.id, id));
      return { message: `Payment ${id} updated successfully` };
    } catch (error) {
      throw new RpcException('Failed to update payment');
    }
  }

  async remove(id: string) {
    try {
      await this.drizzleService.db.delete(Payments).where(eq(Payments.id, id));
      return { message: `Payment ${id} removed successfully` };
    } catch (error) {
      throw new RpcException('Failed to remove payment');
    }
  }

  async removeAllPayments() {
    try {
      await this.drizzleService.db.delete(Payments);
      return { message: `All Payments removed successfully` };
    } catch (error) {
      throw new RpcException('Failed to remove payment');
    }
  }
}
