import { InputType, Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  userId: string;

  @Field()
  membershipId: string;

  @Field()
  method: string;

  @Field()
  paymentDate: string;

  @Field()
  callback_url: string;

  @Field({nullable: true})
  reference: string;
}

@InputType()
export class CreatePaymentInput {
  @Field()
  email: string;

  @Field()
  userId: string;

  @Field()
  membershipId: string;

  @Field()
  method: string;

  @Field(() => GraphQLISODateTime)
  paymentDate: Date;

  @Field()
  callback_url: string;

  @Field({nullable: true})
  reference: string;
}
