import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum SubscriptionFeature {
  LIVE_MEETINGS = "LIVE_MEETINGS",
  REPLAY_ACCESS = "REPLAY_ACCESS",
  STANDARD_SUPPORT = "STANDARD_SUPPORT",
  PRIORITY_SUPPORT = "PRIORITY_SUPPORT",
  EXCLUSIVE_SESSIONS = "EXCLUSIVE_SESSIONS",
  PRIVATE_COMMUNITY = "PRIVATE_COMMUNITY",
  BASIC_SUPPORT = "BASIC_SUPPORT",
}

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  price: number;

  @IsString()
  @IsOptional()
  currency?: string = "GHS";

  @IsInt()
  durationDays: number;

  @IsArray()
  @IsEnum(SubscriptionFeature, { each: true })
  features: SubscriptionFeature[];

  @IsBoolean()
  @IsOptional()
  mostPopular?: boolean = false;
}
