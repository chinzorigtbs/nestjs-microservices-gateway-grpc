import { UserDto } from './user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(payload: UserDto): Promise<void>;
    encodePassword(password: string): string;
}
