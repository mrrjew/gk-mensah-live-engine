import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, ValidateIf } from 'class-validator';

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  @ValidateIf((o) => !o.username && !o.phoneNumber)
  @IsEmail()
  email?: string;

  @Field()
  @IsString()
  @MinLength(3)
  password: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email && !o.username)
  @IsString()
  phoneNumber?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email && !o.phoneNumber)
  @IsString()
  username?: string;
}
