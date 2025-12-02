import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject, OnModuleInit, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  Auth,
  CreateUserInput,
  CreateAdminUserInput,
} from './dto/create-user.dto';
import { LoginInput } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseService } from '../../common/utils/response';
import { SuperAdminGuard } from '../../common/guards/superAdmin.guard';
import {
  AuthenticationGrpcService,
  Empty,
  PingReply,
} from '../../grpc/core-grpc.types';

@Resolver(() => Auth)
export class AuthenticationResolver implements OnModuleInit {
  private authenticationService: AuthenticationGrpcService;

  constructor(
    @Inject('CORE_SERVICE') private readonly coreService: ClientGrpc,
    @Inject('RESPONSE') private readonly responseService: ResponseService,
  ) {}

  onModuleInit() {
    this.authenticationService =
      this.coreService.getService<AuthenticationGrpcService>(
        'AuthenticationService',
      );
  }

  @Query(() => String, { name: 'ping' })
  @Public()
  async ping() {
    const response = await this.responseService.sendRequest<PingReply>(
      this.authenticationService.ping({} as Empty),
    );
    return response.message;
  }

  @Query(() => String, { name: 'pingDB' })
  @Public()
  async pingDatabase() {
    const response = await this.responseService.sendRequest<PingReply>(
      this.authenticationService.pingDatabase({} as Empty),
    );
    return response.message;
  }

  @Mutation(() => Auth, { name: 'createUser' })
  @Public()
  async createUser(@Args('input') input: CreateUserInput) {
    return this.responseService.sendRequest<Auth>(
      this.authenticationService.createUser(input),
    );
  }

  @Mutation(() => Auth, { name: 'loginUser' })
  @Public()
  /**
   * Logs in a user with the provided credentials.
   * The responseService takes in a pattern or an observable to send the request to the microservice.
   * @param input - The login input containing user credentials.
   * @returns The authentication response containing tokens and user info.
   */
  async loginUser(@Args('input') input: LoginInput) {
    const res = await this.responseService.sendRequest<Auth>(
      this.authenticationService.loginUser(input),
    );
    console.log(res)
    return res;
  }

  @Mutation(() => Auth, { name: 'createAdminUser' })
  @UseGuards(SuperAdminGuard)
  async createAdminUser(@Args('input') input: CreateAdminUserInput) {
    return this.responseService.sendRequest<Auth>(
      this.authenticationService.createAdminUser(input),
    );
  }
}
