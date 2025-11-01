import { IsBoolean, IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMembershipDto {
  @IsInt()
  userId: number;

  @IsInt()
  subscriptionId: number;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
