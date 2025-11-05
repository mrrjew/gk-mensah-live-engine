import { Type } from 'class-transformer';

export class CreateMembershipDto {
  userId: string;
  subscriptionId: string;
  paymentReference?: string;
  isActive?: boolean;
}
