import { Field, InputType, Int, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Membership {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  subscriptionId: string;

  @Field()
  startDate:string

  @Field()
  endDate: string;

  @Field({ nullable: true })
  paymentReference?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@ObjectType()
export class MembershipResponse {
  @Field()
  success: boolean;
  @Field()
  message: string;
}

@InputType()
export class CreateMembershipInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  subscriptionId: string;

  @Field({ nullable: true })
  paymentReference?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}
