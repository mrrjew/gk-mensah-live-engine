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
  async me(payload: { data?: any }) {
    try {
      if (!payload?.data?.user || !payload?.data?.user?.sub) {
        throw new RpcException('Unauthorized: Missing user info');
      }

      const user = await this.usersService.me(payload.data);
      return { data: user };
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
    const user = await this.usersService.findOne(data.id);
    return { data: user };
  }

  @GrpcMethod('UsersService', 'UpdateUser')
  async update(payload: { data?: UpdateUserDto }) {
    const updateUserDto = payload?.data;
    if (!updateUserDto?.id) throw new RpcException('Missing user ID');
    const message = await this.usersService.update(
      updateUserDto.id,
      updateUserDto,
    );
    return { data: message };
  }

  @GrpcMethod('UsersService', 'RemoveUser')
  async remove(data: { id: string }) {
    if (!data?.id) throw new RpcException('Missing ID');
    const message = await this.usersService.remove(data.id);
    return { data: message };
  }

  @GrpcMethod('UsersService', 'RemoveAllUsers')
  async removeAllUsers() {
    const message = await this.usersService.removeAllUsers();
    return { data: message };
  }
}
