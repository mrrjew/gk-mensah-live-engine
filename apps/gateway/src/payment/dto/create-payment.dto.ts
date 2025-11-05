import { InputType, Field, ObjectType, GraphQLISODateTime } from "@nestjs/graphql";

@ObjectType()
export class Payment {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  membershipId: string;

  @Field()
  amount: string;

  @Field()
  method: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  reference?: string;

  @Field({ nullable: true })
  callbackUrl?: string;

  @Field(() => GraphQLISODateTime)
  paymentDate: Date;
}

@InputType()
export class CreatePaymentInput {
  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  membershipId: string;

  @Field()
  method: string;

  @Field({ nullable: true })
  reference?: string;

  @Field({ nullable: true })
  callbackUrl?: string;

  @Field(() => GraphQLISODateTime)
  paymentDate: Date;
}
