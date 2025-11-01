import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field()
  email: string;

  @Field()
  membershipId: number;

  @Field()
  method: string;

  @Field()
  paymentDate: string;

  @Field()
  callback_url: string;

  @Field({nullable: true})
  reference: string;
}
