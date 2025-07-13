import { DrizzleService} from '@app/lib/core/drizzle';
import { Injectable,HttpException, HttpServer,BadRequestException } from '@nestjs/common';
import { userSchema } from '../entities';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from '@app/lib/core/hashing';

@Injectable()
export class AuthenticationService {
    constructor(private readonly drizzleService: DrizzleService,private hashService:HashService) {}

    async pingDatabase() {
        try {
            const result = this.drizzleService.onModuleInit();
            return result;
        } catch (error) {
            console.error('Database ping failed:', error);
            throw new Error('Database connection failed');
        }
    }

    async createUser(userData:CreateUserDto) {
        try {
            const existingUser = await this.drizzleService.db
                .select()
                .from(userSchema)
                .where(eq(userSchema.email,userData.email));

            if (existingUser.length > 0) {
                throw new BadRequestException('User already exists');
            }

            // Validate required fields
            if (!userData.username || !userData.email || !userData.password) {
                throw new BadRequestException('Username, email, and password are required');
            }

            // Hash the password
            userData.password = await this.hashService.hashPassword(userData.password);

            const _userData = {...userData,password:userData.password,createdAt:new Date(),updatedAt:new Date()};
            // Create the user
            const result = await this.drizzleService.db.insert(userSchema).values(_userData).returning();

            console.log('User created successfully:', result);
            return result;
        } catch (error) {
            console.error('User creation failed:', error);
            throw new Error('User creation failed');
        }
    }
}
