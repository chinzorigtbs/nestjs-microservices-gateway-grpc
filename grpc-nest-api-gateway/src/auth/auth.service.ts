import { Inject, Injectable } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ValidateResponse,
} from './auth.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Log } from 'src/app.module';

@Injectable()
export class AuthService {
  private service: AuthServiceClient;
  private readonly logger: Log = new Log(AuthService.name);
  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.service = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  public async validate(token: string): Promise<ValidateResponse> {
    this.logger.debug('ValidateRequest', token);
    return firstValueFrom(this.service.validate({ token }));
  }
}
