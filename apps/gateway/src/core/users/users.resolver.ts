import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { User } from '../authentication/dto/create-user.dto';
import { StringResponse, UpdateUserInput } from './dto/update-user.input';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseService } from '../../common/utils/response';
import {
  Empty,
  PingReply,
  StructList,
  StructPayload,
  UsersGrpcService,
} from '../../grpc/core-grpc.types';

@Resolver(() => User)
export class UsersResolver implements OnModuleInit {
  private usersService: UsersGrpcService;

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

    if (!req?.user) {
      throw new Error('Unauthorized: Missing user in context');
    }

    console.log(
      '🧩 Fetching current user info from GraphQL context:',
      req.user,
    );

    const response = await this.responseService.sendRequest<
      StructPayload<User>
    >(this.usersService.me({ data: { user: req.user } }));

    return response.data as User;
  }

  /**
   * Returns all users (typically restricted to admins)
   */
  @Query(() => [User], { name: 'users' })
  async findAll() {
    const response = await this.responseService.sendRequest<StructList<User>>(
      this.usersService.findAll({} as Empty),
    );
    return response.items ?? [];
  }

  /**
   * Returns a specific user by ID
   */
  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    const response = await this.responseService.sendRequest<
      StructPayload<User>
    >(this.usersService.findOne({ id }));
    return response.data as User;
  }

  /**
   * Update user details
   */
  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput) {
    const response = await this.responseService.sendRequest<
      StructPayload<User>
    >(this.usersService.updateUser({ data: input }));
    return response.data as User;
  }

  /**
   * Remove user by ID
   */
  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    const response = await this.responseService.sendRequest<
      StructPayload<User>
    >(this.usersService.removeUser({ id }));
    return response.data as User;
  }

  /**
   * Removes all users (for testing)
   */
  @Mutation(() => StringResponse)
  async removeAllUsers() {
    const response = await this.responseService.sendRequest<
      StructPayload<StringResponse>
    >(this.usersService.removeAllUsers({} as Empty));
    return response.data ?? { message: 'All users removed successfully' };
  }
}
