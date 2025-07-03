import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input.dto';
import { AuthResponse } from './dto/auth.response.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(@Args('data') data: AuthInput): Promise<AuthResponse> {
    const result = await this.authService.signup(data.email, data.password);
    return {
      accessToken: result.accessToken,
      email: result.user.email,
    };
  }

  @Mutation(() => AuthResponse)
  async signin(@Args('data') data: AuthInput): Promise<AuthResponse> {
    const result = await this.authService.signin(data.email, data.password);
    return {
      accessToken: result.accessToken,
      email: result.user.email,
    };
  }
}
