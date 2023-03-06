import { UserService } from './user.service';
import { UserDto } from './user.dto';
export declare class UserController {
    private readonly service;
    constructor(service: UserService);
    createUser(payload: UserDto): Promise<void>;
}
