import {CanActivate,ExecutionContext,HttpStatus,Inject,Injectable,UnauthorizedException,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateResponse } from './auth.pb';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) public readonly service: AuthService) {}

  public async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | never {
    const req: IRequest = context.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    const { status, userId }: ValidateResponse = await this.service.validate(
      token,
    );

    req.user = userId;

    if (status !== HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

export interface IRequest extends Request {
  user: number;
}
