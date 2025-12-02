import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { User } from '../authentication/dto/create-user.dto';
import { StringResponse, UpdateUserInput } from './dto/update-user.input';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseService } from '../../common/utils/response';
import {
  Empty,
  GenericResponse,
  MeRequest,
  PingReply,
  UpdateUserRequest,
  User as GrpcUser,
  UsersGrpcService,
  UsersList,
} from '../../grpc/core-grpc.types';

@Resolver(() => User)
export class UsersResolver implements OnModuleInit {
  private usersService: UsersGrpcService;
  private readonly dateFields: (keyof GrpcUser)[] = [
    'createdAt',
    'updatedAt',
    'lastLogin',
    'resetTokenExpiry',
    'lockExpiry',
    'deletedAt',
    'passwordResetRequestedAt',
    'emailVerificationTokenExpiry',
    'lastFailedLogin',
    'lastPasswordReset',
    'passwordResetTokenExpiry',
    'lastSecurityQuestionChange',
    'lastSecurityAnswerChange',
    'passwordChangeDeadline',
    'accountRecoveryTokenExpiry',
    'accountRecoveryRequestedAt',
    'accountRecoveryVerificationTokenExpiry',
    'accountRecoveryVerificationRequestedAt',
  ];

  constructor(
    @Inject('CORE_SERVICE') private readonly coreService: ClientGrpc,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  onModuleInit() {
    this.usersService =
      this.coreService.getService<UsersGrpcService>('UsersService');
  }

  /**
   * Simple ping to verify service communication
   */
  @Query(() => String, { name: 'pingMe' })
  @Public()
  async pingMe() {
    const response = await this.responseService.sendRequest<PingReply>(
      this.usersService.pingMe({} as Empty),
    );
    return response.message;
  }

  /**
   * Returns the currently authenticated user
   */
  @Query(() => User, { name: 'me' })
  async me(@Context() context: any) {
    const req = context.req;
    console.log('GraphQL context request object:', req.user);
    console.log('GraphQL context object:', context.req.user);

    if (!req?.user) {
      throw new Error('Unauthorized: Missing user in context');
    }

    console.log(
      '🧩 Fetching current user info from GraphQL context:',
      req.user,
    );

    const response = await this.responseService.sendRequest<GrpcUser>(
      this.usersService.me({ userId: req.user.sub } as MeRequest),
    );

    return this.toGraphqlUser(response);
  }

  /**
   * Returns all users (typically restricted to admins)
   */
  @Query(() => [User], { name: 'users' })
  async findAll() {
    const response = await this.responseService.sendRequest<UsersList>(
      this.usersService.findAll({} as Empty),
    );
    return (response.items ?? []).map((user) => this.toGraphqlUser(user));
  }

  /**
   * Returns a specific user by ID
   */
  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    const response = await this.responseService.sendRequest<GrpcUser>(
      this.usersService.findOne({ id }),
    );
    return this.toGraphqlUser(response);
  }

  /**
   * Update user details
   */
  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput) {
    const { id, ...userData } = input;
    const response = await this.responseService.sendRequest<GrpcUser>(
      this.usersService.updateUser({
        id,
        user: userData,
      } as UpdateUserRequest),
    );
    return this.toGraphqlUser(response);
  }

  /**
   * Remove user by ID
   */
  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    const response = await this.responseService.sendRequest<GrpcUser>(
      this.usersService.removeUser({ id }),
    );
    return this.toGraphqlUser(response);
  }

  /**
   * Removes all users (for testing)
   */
  @Mutation(() => StringResponse)
  async removeAllUsers() {
    const response = await this.responseService.sendRequest<GenericResponse>(
      this.usersService.removeAllUsers({} as Empty),
    );
    return {
      message: response?.message ?? 'All users removed successfully',
    };
  }

  private toGraphqlUser(user?: GrpcUser | null): User {
    if (!user) {
      throw new Error('User payload missing');
    }

    const normalized: Record<string, any> = { ...user };
    this.dateFields.forEach((field) => {
      if (normalized[field as string]) {
        normalized[field as string] = new Date(normalized[field as string]);
      }
    });

    return normalized as User;
  }
}
