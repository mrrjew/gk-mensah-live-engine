import { User } from '../../authentication/dto/create-user.dto';
import { InputType, Field, Int, PartialType, ObjectType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(User) {
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class StringResponse {
  @Field()
  message: string;
}