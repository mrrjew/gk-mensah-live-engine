import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;
}

@ObjectType()
export class Auth {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}