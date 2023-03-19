import { UserDto } from './user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { ProjectDto } from './project.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly projectRepository;
    constructor(userRepository: Repository<User>, projectRepository: Repository<Project>);
    createUser(payload: UserDto): Promise<void>;
    createProject(payload: ProjectDto): Promise<void>;
    queryBuilder(userId: string, username: string): Promise<User[]>;
    rawQuery(userId: string, username: string): Promise<any>;
    encodePassword(password: string): string;
}
