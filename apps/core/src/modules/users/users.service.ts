import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleService } from '@app/lib/core/drizzle';
import { Users } from './entities';
import { eq } from 'drizzle-orm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async me(payload: { user?: { sub?: string } }) {
    try {
      console.log('From DB payload:', payload);

      // Validate that the user info was actually passed
      if (!payload?.user?.sub) {
        throw new RpcException('User ID not provided in request payload');
      }

      const [user] = await this.drizzleService.db
        .select()
        .from(Users)
        .where(eq(Users.id, (payload.user.sub)));

      if (!user) throw new RpcException('User not found');

      return user;
    } catch (error) {
      console.error('❌ me() error:', error);
      throw new RpcException('Failed to fetch user data');
    }
  }

  async findAll() {
    try {
      const users = await this.drizzleService.db.select().from(Users);
      return users;
    } catch (error) {
      throw new RpcException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      const [user] = await this.drizzleService.db
        .select()
        .from(Users)
        .where(eq(Users.id, id));
      if (!user) throw new RpcException('User not found');
      return user;
    } catch (error) {
      throw new RpcException('Failed to fetch user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.drizzleService.db
        .update(Users)
        .set(updateUserDto)
        .where(eq(Users.id, id));
      return { message: `User ${id} updated successfully` };
    } catch (error) {
      throw new RpcException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      await this.drizzleService.db.delete(Users).where(eq(Users.id, id));
      return { message: `User ${id} removed successfully` };
    } catch (error) {
      throw new RpcException('Failed to remove user');
    }
  }

  async removeAllUsers() {
    try {
      await this.drizzleService.db.delete(Users);
      return { message: `All Users removed successfully` };
    } catch (error) {
      throw new RpcException('Failed to remove user');
    }
  }
}
