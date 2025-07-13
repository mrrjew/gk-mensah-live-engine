import { Inject } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { Auth, CreateUserInput, User } from "./dto/create-user.dto"; 
import { ClientProxy } from "@nestjs/microservices";
import { ApolloError } from 'apollo-server-errors';

@Resolver(() => Auth)
export class AuthenticationResolver {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) {}

    @Query(() => String, { name: 'ping' })
    async ping() {
        return this.authService.send<String>('pingAuthentication', "");
    }

    @Query(() => String, { name: 'pingDB' })
    async pingDatabase() {
        return this.authService.send<String>('pingAuthenticationDatabase', "");
    }

    @Mutation(() => User, { name: 'createUser' })
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    try {
        const user = await this.authService.send<User>('createUser', createUserInput);
        console.log("createUser resolved user: ", user);
        return user;
    } catch (error) {
        console.error("createUser error: ", error);

        // Throw explicit GraphQL error with custom message
        throw new ApolloError(error.message || 'Failed to create user', 'CREATE_USER_ERROR');
    }
    }

}