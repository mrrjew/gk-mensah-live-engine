import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../authentication/dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseService } from '../../common/utils/response';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @Inject('CORE_SERVICE') private readonly coreService: ClientProxy,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  /**
   * Simple ping to verify service communication
   */
  @Query(() => String, { name: 'pingMe' })
  @Public()
  async pingMe() {
    return this.responseService.sendRequest<string>(
      'pingMe',
      {},
      this.coreService,
    );
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

    console.log('🧩 Fetching current user info from GraphQL context:', req.user);

    return this.responseService.sendRequest<User>(
      { service: 'users', cmd: 'me' },
      { user: req.user },
      this.coreService,
    );
  }

  /**
   * Returns all users (typically restricted to admins)
   */
  @Query(() => [User], { name: 'users' })
  async findAll() {
    return this.responseService.sendRequest<User[]>(
      { service: 'users', cmd: 'findAll' },
      {},
      this.coreService,
    );
  }

  /**
   * Returns a specific user by ID
   */
  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.responseService.sendRequest<User>(
      { service: 'users', cmd: 'findOne' },
      { id },
      this.coreService,
    );
  }

  /**
   * Update user details
   */
  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput) {
    return this.responseService.sendRequest<User>(
      { service: 'users', cmd: 'updateUser' },
      input,
      this.coreService,
    );
  }

  /**
   * Remove user by ID
   */
  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    return this.responseService.sendRequest<User>(
      { service: 'users', cmd: 'removeUser' },
      { id },
      this.coreService,
    );
  }

  /**
   * Removes all users (for testing)
   */
  @Mutation(() => User)
  async removeAllUsers() {
    return this.responseService.sendRequest<User>(
      { service: 'users', cmd: 'removeAllUsers' },
      {},
      this.coreService,
    );
  }
}
