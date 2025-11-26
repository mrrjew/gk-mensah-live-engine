import { DrizzleService} from '@app/lib/core/drizzle';
import { Injectable,HttpException, HttpServer,BadRequestException } from '@nestjs/common';
import { UserRole } from '../../modules/users/entities/user.base';
import { Users } from '../../modules/users/entities';
import { eq,or, SQL } from 'drizzle-orm';
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
            console.log('Creating user with payload:', payload.password);
            const conditions = [
                eq(Users.email,payload.email),
                eq(Users.username,payload.username),
            ];
            
            if (payload.phoneNumber) {
                conditions.push(eq(Users.phoneNumber,payload.phoneNumber));
            }

            const existingUsers = await this.drizzleService.db
            .select({
                email: Users.email,
                username: Users.username,
                phoneNumber: Users.phoneNumber,
            })
            .from(Users)
                .where(or(...conditions));

            
            if (existingUsers.length > 0) {
            const existing = existingUsers[0];

            if (existing.email === payload.email) {
                throw new BadRequestException('Email already exists');
            }

            if (existing.username === payload.username) {
                throw new BadRequestException('Username already exists');
            }

            if (existing.phoneNumber === payload.phoneNumber) {
                throw new BadRequestException('Phone number already exists');
            }
            }
            
            // Validate required fields
            if (!payload.username || !payload.email || !payload.password) {
                throw new BadRequestException('Username, email, and password are required');
            }
            
            // Hash passwords
            payload.password = await this.hashService.hashPassword(payload.password);
            if(payload.role == "Admin"){
                payload.adminKey =  await this.hashService.hashPassword(payload.adminKey)
            }

            // Validate and type the role
            const validRoles: UserRole[] = ['SuperAdmin', 'Admin', 'User'];
            const userRole: UserRole = (validRoles.includes(payload.role as UserRole) ? payload.role : 'User') as UserRole;

            const _payload = {
                ...payload,
                password: payload.password,
                adminKey: payload.adminKey,
                role: userRole,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Create the user
            const user = await this.drizzleService.db.insert(Users).values(_payload).returning();
            return this.generateToken(user[0]);
        } catch (error) {
            console.error('User creation failed:', error.response);
            throw new BadRequestException(error.response);
        }
    }

      async validateThirdParty(payload:any) {
        try {
            const user = await this.drizzleService.db
                    .select()
                    .from(Users)
                    .where(or(
                    eq(Users.email,payload.email),
                    eq(Users.username,payload.username),
                    eq(Users.phoneNumber,payload.phoneNumber)
                ));

        if (user) return this.loginUser(user[0]);

        return this.createUser(payload);
        } catch (e) {
        throw new BadRequestException(e.response);
        }
    }


    async validateUser(payload:any) { 
        try {
            console.log(payload)
            const conditions:SQL[] = [];
            
            if (payload.email) {
            conditions.push(eq(Users.email, payload.email));
            }

            if (payload.username) {
            conditions.push(eq(Users.username, payload.username));
            }

            if (payload.phoneNumber) {
            conditions.push(eq(Users.phoneNumber, payload.phoneNumber));
            }
            
            if (conditions.length === 0) {
                throw new BadRequestException('You must provide an email, username, or phone number');
            }
                console.log(conditions)

            const user = await this.drizzleService.db
            .select()
            .from(Users)
            .where(or(...conditions));

            if (user.length === 0) {
                throw new BadRequestException('No user found with the provided email');
            }

            const isPasswordValid = await this.hashService.verifyPassword(payload.password,user[0].password,);
            if (!isPasswordValid) {
                throw new BadRequestException('Invalid email or password');
            }

            return this.loginUser(user[0]);

        } catch (error) {
            console.error('Login failed:', error.response);
            throw new BadRequestException(error.response);
        }
    }

    async loginUser(payload: any) {

    return this.generateToken(payload);

  }
    private async generateToken(user: any) {
    const payload = {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role
    };
    
    return {
        accessToken: await this.jwtService.signAsync(payload),
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username
        }
    };
}
    
}
