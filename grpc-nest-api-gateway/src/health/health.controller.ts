import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions } from '@nestjs/microservices';
import {
  GRPCHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { AUTH_SERVICE_NAME, protobufPackage } from 'src/auth/auth.pb';

@Controller('health')
export class HealthController {
  constructor(
    private configService: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private grpc: GRPCHealthIndicator,
  ) {}

  @Get('http')
  @HealthCheck()
  checkHttp() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'gateway',
          this.configService.get<string>('HEALTH_HTTP_URL'),
        ),
    ]);
  }

  @Get('grpc/auth')
  @HealthCheck()
  checkAuthGrpc() {
    return this.health.check([
      () =>
        this.grpc.checkService<GrpcOptions>(
          AUTH_SERVICE_NAME,
          protobufPackage,
          {
            timeout: 2000,
            package: protobufPackage,
            url: this.configService.get<string>('AUTH_CLIENT_URL'),
            protoPath: this.configService.get<string>('AUTH_CLIENT_PROTO_PATH'),
          },
        ),
    ]);
  }
}
