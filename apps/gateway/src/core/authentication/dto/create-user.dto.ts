import { ObjectType, Field, Int, InputType, PickType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  password: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  lastLogin: Date;

  @Field()
  isActive: boolean;

  @Field()
  isEmailVerified: boolean;

  @Field()
  isTwoFactorEnabled: boolean;

  @Field({ nullable: true })
  twoFactorSecret?: string;

  @Field({ nullable: true })
  resetToken?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field()
  resetTokenExpiry: Date;

  @Field()
  lockExpiry: Date;

  @Field({ nullable: true })
  createdBy?: string;

  @Field({ nullable: true })
  updatedBy?: string;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  deletedBy?: string;

  @Field(() => GraphQLJSON)
  metadata: Record<string, any>;

  @Field({ nullable: true })
  sessionId?: string;

  @Field(() => GraphQLJSON)
  deviceInfo: Record<string, any>;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field(() => [String])
  twoFactorBackupCodes: string[];

  @Field()
  passwordResetRequestedAt: Date;

  @Field({ nullable: true })
  emailVerificationToken?: string;

  @Field()
  emailVerificationTokenExpiry: Date;

  @Field()
  lastFailedLogin: Date;

  @Field(() => Int)
  failedLoginAttempts: number;

  @Field()
  lastPasswordReset: Date;

  @Field({ nullable: true })
  passwordResetToken?: string;

  @Field()
  passwordResetTokenExpiry: Date;

  @Field()
  accountStatus: string;

  @Field(() => [GraphQLJSON])
  securityQuestions: any[];

  @Field(() => [GraphQLJSON])
  securityAnswers: any[];

  @Field()
  lastSecurityQuestionChange: Date;

  @Field()
  lastSecurityAnswerChange: Date;

  @Field()
  passwordChangeRequired: boolean;

  @Field()
  passwordChangeDeadline: Date;

  @Field({ nullable: true })
  accountRecoveryEmail?: string;

  @Field({ nullable: true })
  accountRecoveryPhone?: string;

  @Field({ nullable: true })
  accountRecoveryToken?: string;

  @Field()
  accountRecoveryTokenExpiry: Date;

  @Field()
  accountRecoveryRequestedAt: Date;

  @Field()
  accountRecoveryStatus: string;

  @Field()
  accountRecoveryMethod: string;

  @Field()
  accountRecoveryVerified: boolean;

  @Field({ nullable: true })
  accountRecoveryVerificationToken?: string;

  @Field()
  accountRecoveryVerificationTokenExpiry: Date;

  @Field()
  accountRecoveryVerificationRequestedAt: Date;
}

@ObjectType()
export class PublicUser extends PickType(User, [
  'id',
  'email',
  'username'] as const) {}

@ObjectType()
export class Auth {
  @Field()
  accessToken: string;

  @Field(() => PublicUser)
  user: PublicUser;
}

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}