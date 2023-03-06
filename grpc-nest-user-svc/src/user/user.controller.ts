import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern } from '@nestjs/microservices';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @EventPattern('user_created')
  async createUser(payload: UserDto): Promise<void> {
    await this.service.createUser(payload);
  }
}
