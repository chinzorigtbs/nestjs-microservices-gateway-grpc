import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Put,
} from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Log } from 'src/app.module';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, RegisterRequestDto } from './auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController implements OnModuleInit {
  private service: AuthServiceClient;
  private readonly logger: Log = new Log(AuthController.name);

  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.service = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  private async register(
    @Body() body: RegisterRequestDto,
  ): Promise<Observable<RegisterResponse>> {
    this.logger.debug('RegisterRequest', body);
    return this.service.register(body);
  }

  @Put('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  private async login(
    @Body() body: LoginRequestDto,
  ): Promise<Observable<LoginResponse>> {
    this.logger.debug('LoginRequest', body);
    return this.service.login(body);
  }
}
