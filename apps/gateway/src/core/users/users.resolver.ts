import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from '../authentication/dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { Public } from '../common/decorators/public.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(@Inject('CORE_SERVICE') private readonly coreService: ClientProxy) {}

  // Simple ping to verify service communication
  @Query(() => String, { name: 'pingMe' })
  @Public()
  async pingMe() {
    const result = await lastValueFrom(
      this.coreService.send('pingMe', {})
    );
    return result;
  }

  /**
   * Returns the currently authenticated user.
   * Requires a valid JWT token.
   */
  @Query(() => User, { name: 'me' })
  async me(@Context() context: any) {
    const req = context.req;

    if (!req?.user) {
      throw new Error('Unauthorized: Missing user in context');
    }

    console.log('🧩 Fetching current user info from GraphQL context:', req.user);

    const result = await lastValueFrom(
      this.coreService.send(
        { service: 'users', cmd: 'me' },
        { user: req.user }
      )
    );

    return result;
  }

  /**
   * Returns all users (example only, usually restricted to admins)
   */
  @Query(() => [User], { name: 'users' })
  async findAll() {
    return lastValueFrom(
      this.coreService.send({ service: 'users', cmd: 'findAll' }, {})
    );
  }

  /**
   * Returns a specific user by ID
   */
  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return lastValueFrom(
      this.coreService.send({ service: 'users', cmd: 'findOne' }, { id })
    );
  }

  /**
   * Update user details
   */
  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return lastValueFrom(
      this.coreService.send({ service: 'users', cmd: 'updateUser' }, updateUserInput)
    );
  }

  /**
   * Remove user by ID
   */
  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return lastValueFrom(
      this.coreService.send({ service: 'users', cmd: 'removeUser' }, { id })
    );
  }
  /**
   * Removes all users
   * Only for testing
   */
  @Mutation(() => User)
  async removeAllUsers() {
    return lastValueFrom(
      this.coreService.send({ service: 'users', cmd: 'removeAllUsers' }, {})
    );
  }
}
