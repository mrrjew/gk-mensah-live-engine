import { Inject } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { Auth, CreateUserInput, User } from "./dto/create-user.dto"; 
import { ClientProxy } from "@nestjs/microservices";

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

}