import { DrizzleService} from '@app/lib/core/drizzle';
import { Injectable,HttpException, HttpServer,BadRequestException } from '@nestjs/common';
import { Users } from '../../modules/users/entities';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from '@app/lib/core/hashing';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthenticationService {
    constructor(private readonly drizzleService: DrizzleService,
        private hashService:HashService,
        private jwtService: JwtService
) {}

    async pingDatabase() {
        try {
            const result = this.drizzleService.onModuleInit();
            return result;
        } catch (error) {
            console.error('Database ping failed:', error);
            throw new Error('Database connection failed');
        }
    }

    async createUser(payload:CreateUserDto) {
        try {
            console.log('Received createUser payload1:', payload);
            const existingUser = await this.drizzleService.db
            .select()
            .from(Users)
                .where(eq(Users.email,payload.email));

            console.log('Received createUser payload1.2:', payload);
            if (existingUser.length > 0) {
                throw new BadRequestException('User already exists');
            }
            console.log('Received createUser payload1.3:', payload);
            
            // Validate required fields
            if (!payload.username || !payload.email || !payload.password) {
                throw new BadRequestException('Username, email, and password are required');
            }
            console.log('Received createUser payload1.4:', payload);
            
            // Hash the password
            payload.password = await this.hashService.hashPassword(payload.password);
            const _payload = {...payload,password:payload.password,createdAt:new Date(),updatedAt:new Date()};
            console.log('Received createUser payload1.5:', payload);
            // Create the user
            console.log('Creating user with payload:', _payload);
            const user = await this.drizzleService.db.insert(Users).values(_payload).returning();
            console.log('User created successfully:', user);
            console.log('Received createUser payload1.5 :', payload);
            return this.generateToken(user[0]);
        } catch (error) {
            console.error('User creation failed:', error.response);
            throw new BadRequestException('User creation failed',error.response);
        }
    }

      async validateThirdParty(payload:any) {
    try {
        const user = await this.drizzleService.db
                .select()
                .from(Users)
                .where(eq(Users.email,payload.email));

      if (user) return this.loginUser(user[0]);

      return this.createUser(payload);
    } catch (e) {
      throw new BadRequestException(e.response);
    }
  }


    async validateUser(payload:LoginDto) { 
        try {
            const user = await this.drizzleService.db
                .select()
                .from(Users)
                .where(eq(Users.email,payload.email));

            if (user.length === 0) {
                throw new BadRequestException('No user found with the provided email');
            }


            const isPasswordValid = await this.hashService.verifyPassword(payload.password,user[0].password,);
            if (!isPasswordValid) {
                throw new BadRequestException('Invalid email or password');
            }

            return this.loginUser(user[0]);

        } catch (error) {
            console.error('Login failed:', error);
            throw new BadRequestException('Login failed',error);
        }
    }

    async loginUser(payload: any) {

    return this.generateToken(payload);

  }
    private async generateToken(user: any) {
    const payload = {
        sub: user.id,
        email: user.email,
        username: user.username
    };
    
    return {
        accessToken: await this.jwtService.signAsync(payload),
        user: {
            id: user.id,
            email: user.email,
            username: user.username
        }
    };
}
    
}
