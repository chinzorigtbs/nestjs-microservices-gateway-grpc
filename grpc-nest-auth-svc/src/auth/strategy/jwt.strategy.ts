import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '../service/jwt.service';
import { Auth } from '../auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'dev',
      ignoreExpiration: true,
    });
  }

  private validate(token: string): Promise<Auth | never> {
    return this.jwtService.validateUser(token);
  }
}
