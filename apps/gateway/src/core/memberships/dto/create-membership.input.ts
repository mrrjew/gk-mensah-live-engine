import { Field, InputType, Int, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Membership {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  subscriptionId: number;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Field({ nullable: true })
  paymentReference?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@InputType()
export class CreateMembershipInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  subscriptionId: number;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  endDate: Date;

  @Field({ nullable: true })
  paymentReference?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}
