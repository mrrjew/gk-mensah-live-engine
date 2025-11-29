import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { DrizzleService } from '@app/lib/core/drizzle';
import { Users } from 'apps/core/src/modules/users/entities';
import { eq } from 'drizzle-orm';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly drizzleService: DrizzleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext()?.req || ctx.getContext()?.request;

    if (!req || !req.headers) {
      throw new UnauthorizedException('No request available in context');
    }

    // Extract headers
    const adminKey = (
      req.headers['x-admin-key'] || req.headers['X-Admin-Key']
    )?.toString();
    const authHeader = (
      req.headers['authorization'] || req.headers['Authorization']
    )?.toString();
    const token = authHeader?.split(' ')[1];

    // Check for token
    if (!token) {
      throw new UnauthorizedException(
        'Missing JWT token in Authorization header',
      );
    }

    // Verify JWT and extract payload
    let payload: any;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret_key',
      ) as any;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired admin token');
    }

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid JWT payload - missing user ID');
    }

    // Validate JWT has admin role
    const role = payload.role || payload.user?.role;
    const hasValidAdminRole =
      payload.isAdmin === true ||
      (typeof role === 'string' && (role === 'Admin' || role === 'SuperAdmin'));

    if (!hasValidAdminRole) {
      throw new UnauthorizedException(
        'JWT token missing admin role (requires Admin or SuperAdmin)',
      );
    }

    // Check for admin key header
    if (!adminKey) {
      throw new UnauthorizedException(
        'Missing admin key in x-admin-key header',
      );
    }

    // Fetch admin user from database by ID
    try {
      const user = await this.drizzleService.db
        .select()
        .from(Users)
        .where(eq(Users.id, payload.sub));

      if (!user || user.length === 0) {
        throw new UnauthorizedException('Admin user not found');
      }

      const admin = user[0];

      // Compare provided adminKey with hashed key in database
      const isAdminKeyValid = await bcrypt.compare(
        adminKey,
        admin.adminKey || '',
      );

      if (!isAdminKeyValid) {
        throw new UnauthorizedException('Invalid admin key');
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify admin credentials');
    }
  }
}
