import { IsNotEmpty, IsString } from 'class-validator';
import { User } from './user.entity';

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
