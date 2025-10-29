import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('✅ UsersController initialized');
  }

  @MessagePattern('pingMe')
  async pingMe() {
    return 'Me is fine';
  }

  @MessagePattern({ service: 'users', cmd: 'me' })
  async me(data: any) {
    try {

      if (!data?.user || !data?.user?.sub) {
        throw new RpcException('Unauthorized: Missing user info');
      }

      return await this.usersService.me(data);
    } catch (err) {
      console.error('❌ Error in core microservice me():', err);
      throw new RpcException(err?.message || 'Internal server error');
    }
  }

  @MessagePattern({ service: 'users', cmd: 'findAll' })
  async findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ service: 'users', cmd: 'findOne' })
  async findOne(data: { id: number }) {
    if (!data?.id) throw new RpcException('Missing ID');
    return this.usersService.findOne(data.id);
  }

  @MessagePattern({ service: 'users', cmd: 'updateUser' })
  async update(updateUserDto: UpdateUserDto) {
    if (!updateUserDto?.id) throw new RpcException('Missing user ID');
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern({ service: 'users', cmd: 'removeUser' })
  async remove(data: { id: number }) {
    if (!data?.id) throw new RpcException('Missing ID');
    return this.usersService.remove(data.id);
  }

  @MessagePattern({ service: 'users', cmd: 'removeAllUsers' })
  async removeAllUsers() {
    return this.usersService.removeAllUsers();
  }
}
