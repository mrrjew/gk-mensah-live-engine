import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('✅ UsersController initialized');
  }

  @GrpcMethod('UsersService', 'PingMe')
  async pingMe() {
    return { message: 'Me is fine' };
  }

  @GrpcMethod('UsersService', 'Me')
  async me(payload: { userId?: string }) {
    try {
      console.log('🔍 Received me() request with payload:', payload);
      if (!payload?.userId) {
        throw new RpcException('Unauthorized: Missing user info');
      }

      return await this.usersService.me(payload.userId);
    } catch (err) {
      console.error('❌ Error in core microservice me():', err);
      throw new RpcException(err?.message || 'Internal server error');
    }
  }

  @GrpcMethod('UsersService', 'FindAll')
  async findAll() {
    const users = await this.usersService.findAll();
    return { items: users };
  }

  @GrpcMethod('UsersService', 'FindOne')
  async findOne(data: { id: string }) {
    if (!data?.id) throw new RpcException('Missing ID');
    return this.usersService.findOne(data.id);
  }

  @GrpcMethod('UsersService', 'UpdateUser')
  async update(payload: { id?: string; user?: UpdateUserDto }) {
    if (!payload?.id) throw new RpcException('Missing user ID');
    const updateUserDto = payload.user ?? ({} as UpdateUserDto);
    const message = await this.usersService.update(payload.id, updateUserDto);
    return message;
  }

  @GrpcMethod('UsersService', 'RemoveUser')
  async remove(data: { id: string }) {
    if (!data?.id) throw new RpcException('Missing ID');
    return this.usersService.remove(data.id);
  }

  @GrpcMethod('UsersService', 'RemoveAllUsers')
  async removeAllUsers() {
    return this.usersService.removeAllUsers();
  }
}
