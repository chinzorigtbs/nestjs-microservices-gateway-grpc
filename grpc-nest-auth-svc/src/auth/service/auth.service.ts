import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ValidateRequestDto,
} from '../auth.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly repository: Repository<Auth>,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  public async register({
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    let auth: Auth = await this.repository.findOne({ where: { email } });

    if (auth) {
      return { status: HttpStatus.CONFLICT, error: ['E-mail already exists!'] };
    }

    auth = new Auth();

    auth.email = email;
    auth.password = this.jwtService.encodePassword(password);

    await this.repository.save(auth);

    this.client.emit('user_created', auth);

    return { status: HttpStatus.OK, error: null };
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const auth: Auth = await this.repository.findOne({ where: { email } });

    if (!auth) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['E-mail not found!'],
        token: null,
      };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(
      password,
      auth.password,
    );

    if (!isPasswordValid) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['Wrong password!'],
        token: null,
      };
    }

    const token: string = this.jwtService.generateToken(auth);

    return { status: HttpStatus.OK, error: null, token };
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded: Auth = await this.jwtService.verify(token);

    if (!decoded) {
      return {
        status: HttpStatus.FORBIDDEN,
        error: ['Invalid access token!'],
        userId: null,
      };
    }

    const auth: Auth = await this.jwtService.validateUser(decoded);

    if (!auth) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['User not found!'],
        userId: null,
      };
    }

    return { status: HttpStatus.OK, error: null, userId: decoded.id };
  }
}
