import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    // Convert from HTTP to GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    console.log('🛡️ JwtGuard checking user:', request.user);

    // If middleware failed to attach user, this will fail
    return !!request.user && Object.keys(request.user).length > 0;
  }
}
