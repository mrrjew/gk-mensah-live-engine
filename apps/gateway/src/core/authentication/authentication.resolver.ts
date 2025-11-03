import { Inject } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { Auth, CreateUserInput, User } from "./dto/create-user.dto"; 
import { ClientProxy } from "@nestjs/microservices";
import { ApolloError } from 'apollo-server-errors';
import { lastValueFrom } from "rxjs";
import { LoginInput } from "./dto/login.dto";
import { Public } from "../common/decorators/public.decorator";

@Resolver(() => Auth)
export class AuthenticationResolver {
    constructor(@Inject('CORE_SERVICE') private readonly coreService: ClientProxy) {}

    @Query(() => String, { name: 'ping' })
    @Public()
    async ping() {
        return this.coreService.send<String>('pingAuthentication', "");
    }
    
    @Query(() => String, { name: 'pingDB' })
    @Public()
    async pingDatabase() {
        return this.coreService.send<String>('pingAuthenticationDatabase', "");
    }
    
    @Mutation(() => Auth, { name: 'createUser' })
    @Public()
    async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    try {
        const user = await lastValueFrom(this.coreService.send<User>({service:'authentication',cmd:'createUser'}, input));
        return user;
    } catch (error) {
            const errorResponse = error.response;
            
            throw new ApolloError(
                errorResponse?.message || error.message,
                error.status === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR',
                errorResponse
            );
    }
}

@Mutation(() => Auth, { name: 'loginUser' })
@Public()
async loginUser(@Args('loginInput') input:LoginInput): Promise<Auth> {
    try {
        const auth = await lastValueFrom(this.coreService.send<Auth>({service:'authentication',cmd:'loginUser'}, input));
        return auth;
    } catch (error) {
        console.error("loginUser error: ", error.message);
        throw new ApolloError(error.message || 'Failed to login user', 'LOGIN_USER_ERROR');
    }
}
}