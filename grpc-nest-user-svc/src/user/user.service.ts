import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { Project } from './project.entity';
import { ProjectDto } from './project.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createUser(payload: UserDto): Promise<void> {
    const user = new User();
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.password = this.encodePassword(payload.password);
    user.gender = payload.gender;
    user.phoneNumber = payload.phoneNumber;
    user.projects = [];
    await this.userRepository.save(user);
  }

  async createProject(payload: ProjectDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.userId,
      },
    });

    const project = new Project();
    project.name = payload.name;
    project.user = user;
    await this.projectRepository.save(project);
  }

  async queryBuilder(userId: string, username: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .andWhere('user.email = :email', { email: username })
      .leftJoinAndSelect('user.projects', 'project')
      .whereInIds([1])
      .orderBy('user.firstName', 'DESC')
      .getMany();
  }

  async rawQuery(userId: string, username: string) {
    const rawQuery =
      'SELECT * FROM USER a LEFT JOIN PROJECT b on a.id = b.userId ' +
      'WHERE a.id = $1 AND a.email = $2 order by a.firstName DESC';
    return this.userRepository
      .query(rawQuery, [userId, username])
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  }


  encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
