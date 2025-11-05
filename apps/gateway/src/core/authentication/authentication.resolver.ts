import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Auth, CreateUserInput, User } from './dto/create-user.dto';
import { LoginInput } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseService } from '../../common/utils/response';

@Resolver(() => Auth)
export class AuthenticationResolver {
  constructor(
    @Inject('CORE_SERVICE') private readonly coreService: ClientProxy,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  @Query(() => String, { name: 'ping' })
  @Public()
  async ping() {
    return lastValueFrom(this.coreService.send<String>('pingAuthentication', ''));
  }

  @Query(() => String, { name: 'pingDB' })
  @Public()
  async pingDatabase() {
    return lastValueFrom(
      this.coreService.send<String>('pingAuthenticationDatabase', ''),
    );
  }

  @Mutation(() => Auth, { name: 'createUser' })
  @Public()
  async createUser(@Args('input') input: CreateUserInput) {
    return this.responseService.sendRequest<Auth>(
      { service: 'authentication', cmd: 'createUser' },
      input,
      this.coreService,
    );
  }

  @Mutation(() => Auth, { name: 'loginUser' })
  @Public()
  async loginUser(@Args('loginInput') input: LoginInput) {
    return this.responseService.sendRequest<Auth>(
      { service: 'authentication', cmd: 'loginUser' },
      input,
      this.coreService,
    );
  }
}
