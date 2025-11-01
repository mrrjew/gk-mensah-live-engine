import { CreateMembershipInput } from "./create-membership.input";
import { Field, InputType, PartialType,Int } from "@nestjs/graphql";

@InputType()
export class UpdateMembershipInput extends PartialType(CreateMembershipInput) {
      @Field(() => Int)
      id: number;
}