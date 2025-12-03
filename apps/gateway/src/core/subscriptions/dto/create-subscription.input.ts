import {
  InputType,
  Field,
  Int,
  registerEnumType,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';

export enum SubscriptionFeature {
  LIVE_MEETINGS = 'LIVE_MEETINGS',
  REPLAY_ACCESS = 'REPLAY_ACCESS',
  STANDARD_SUPPORT = 'STANDARD_SUPPORT',
  PRIORITY_SUPPORT = 'PRIORITY_SUPPORT',
  EXCLUSIVE_SESSIONS = 'EXCLUSIVE_SESSIONS',
  PRIVATE_COMMUNITY = 'PRIVATE_COMMUNITY',
  BASIC_SUPPORT = 'BASIC_SUPPORT',
}

// Register enum for GraphQL
registerEnumType(SubscriptionFeature, {
  name: 'SubscriptionFeature',
  description: 'List of available subscription features',
});

@ObjectType()
export class Subscription {
  @Field(() => String)
  id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => String)
  @IsInt()
  price: number;

  @Field({ nullable: true, defaultValue: 'GHS' })
  @IsString()
  @IsOptional()
  currency?: string = 'GHS';

  @Field(() => Int)
  @IsInt()
  durationDays: number;

  @Field(() => [SubscriptionFeature])
  @IsArray()
  @IsEnum(SubscriptionFeature, { each: true })
  features: SubscriptionFeature[];

  @Field({ defaultValue: false })
  mostPopular?: boolean = false;

  @Field(() => Boolean)
  isArchived: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  archivedAt?: Date | null;
}
@InputType()
export class CreateSubscriptionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Int)
  @IsInt()
  price: number;

  @Field({ nullable: true, defaultValue: 'GHS' })
  @IsString()
  @IsOptional()
  currency?: string = 'GHS';

  @Field(() => Int)
  @IsInt()
  durationDays: number;

  @Field(() => [SubscriptionFeature])
  @IsArray()
  @IsEnum(SubscriptionFeature, { each: true })
  features: SubscriptionFeature[];

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean = false;
}
