import { DrizzleService } from '@app/lib';
import { Injectable } from '@nestjs/common';
import { userSchema } from './entities/user.entity';

@Injectable()
export class AuthenticationService {
    constructor(private readonly drizzleService: DrizzleService) {}

    async pingDatabase() {
        try {
            const result = await this.drizzleService.onModuleInit();
            return result;
        } catch (error) {
            console.error('Database ping failed:', error);
            throw new Error('Database connection failed');
        }
    }
}
