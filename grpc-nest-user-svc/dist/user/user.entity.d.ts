import { UserRole } from './user.enum';
import { Project } from './project.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    phoneNumber: string;
    role: UserRole;
    projects: Project[];
}
