import { Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import schemas from 'src/db/schemas'; 

@Injectable()
export class AuthService {
  private users = schemas.userSchema.users;
  constructor(private jwtService: JwtService, private dbService:DbService) {}

  async signup(email: string, password: string) {
    // Check if user exists
    const existingUser = await this.dbService.db.select().from(this.users).where(eq(this.users.email, email)).limit(1);
    if (existingUser.length) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await argon2.hash(password);
    const result = await this.dbService.db.insert(this.users).values({ email, passwordHash }).returning();

    const user = result[0];

    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
      user,
    };
  }

  async signin(email: string, password: string) {
    const [user] = await this.dbService.db.select().from(this.users).where(eq(this.users.email, email)).limit(1);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
      user,
    };
  }

  async validateUser(userId: number) {
    const [user] = await this.dbService.db.select().from(this.users).where(eq(this.users.id, userId)).limit(1);
    return user || null;
  }
}
