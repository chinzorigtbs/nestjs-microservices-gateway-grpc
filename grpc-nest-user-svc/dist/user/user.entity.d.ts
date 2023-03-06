import { UserRole, UserType } from './user.enum';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
    phoneNumber: string;
    type: UserType;
    role: UserRole;
}
