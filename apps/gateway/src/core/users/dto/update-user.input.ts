import { User } from '../../authentication/dto/create-user.dto';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(User) {
  @Field(() => Int)
  id: number;
}
