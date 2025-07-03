import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthInput } from './dto/auth.input.dto';
import { AuthResponse } from './dto/auth.response.dto';

@Resolver()
export class AuthResolver {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Mutation(() => AuthResponse)
  async signup(@Args('data') data: AuthInput): Promise<AuthResponse> {
    const response$ = this.authClient.send('signup', data);
    return response$;
  }

  @Mutation(() => AuthResponse)
  async signin(@Args('data') data: AuthInput): Promise<AuthResponse> {
    const response$ = this.authClient.send('signin', data);
    return response$;
  }
}
