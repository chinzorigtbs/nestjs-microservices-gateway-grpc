import { Controller, Inject } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  HealthCheckResponse_ServingStatus,
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from './auth.pb';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ValidateRequestDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly svc: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
  private register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.svc.register(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  private login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.svc.login(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  private validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
    return this.svc.validate(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'HealthCheck')
  private healthCheck() {
    return { status: HealthCheckResponse_ServingStatus.SERVING };
  }
}
