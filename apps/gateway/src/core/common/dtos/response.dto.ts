import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ResponseDto <T> {

  @Field({ nullable: true })
  message: string;

  @Field({ nullable: true })
  data?: T;
  
}