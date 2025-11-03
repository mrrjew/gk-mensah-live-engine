import { Type } from 'class-transformer';

export class CreateMembershipDto {
  userId: string;
  subscriptionId: string;
  paymentReference?: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}
