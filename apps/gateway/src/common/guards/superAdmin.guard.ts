import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as jwt from "jsonwebtoken";

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext()?.req || ctx.getContext()?.request;

        if (!req || !req.headers) {
            throw new UnauthorizedException('No request available in context');
        }

        const superAdminKey = (req.headers['x-super-admin-key'] || req.headers['X-Super-Admin-Key'])?.toString();
        const authHeader = (req.headers['authorization'] || req.headers['Authorization'])?.toString();
        const token = authHeader?.split(' ')[1];

        // Require BOTH SuperAdmin API key AND SuperAdmin JWT token
        if (!superAdminKey) {
            throw new UnauthorizedException('Missing Super Admin API key (x-super-admin-key header required)');
        }

        if (superAdminKey !== process.env.SUPER_ADMIN_API_KEY) {
            throw new UnauthorizedException('Invalid Super Admin API key');
        }

        if (!token) {
            throw new UnauthorizedException('Missing JWT token in Authorization header (Bearer token required)');
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key') as any;
            if (payload) {
                const role = payload.role || payload.user?.role;
                if (typeof role === 'string' && (role === 'SuperAdmin' || role === 'Admin')) {
                    return true;
                } else {
                    throw new UnauthorizedException('JWT token must have SuperAdmin or Admin role');
                }
            }
            throw new UnauthorizedException('Invalid JWT payload');
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err;
            throw new UnauthorizedException('Invalid or expired Super Admin token');
        }
    }
}