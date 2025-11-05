import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService,private configService:ConfigService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    try {
      const auth = req.headers.authorization as string | undefined;
      if (!auth?.startsWith('Bearer ')) {
        req['user'] = {};
        return next();
      }

      const token = auth.split(' ')[1];
      const payload = this.jwtService.verify(token,{secret:this.configService.get<string>('JWT_SECRET')});
      req['user'] = payload;
    } catch (err) {
      console.error('❌ JWT verification failed:', err.message);
      req['user'] = {};
    }
    next();
  }
}
