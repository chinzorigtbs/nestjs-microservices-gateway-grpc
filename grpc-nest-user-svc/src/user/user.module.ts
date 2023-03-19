import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
