import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaymentResponse {
  @Field()
  authorization_url: string;

  @Field()
  access_code: string;

  @Field()
  reference: string;
}

@ObjectType()
export class VerifyResponse {
  @Field()
  message: string;
}
