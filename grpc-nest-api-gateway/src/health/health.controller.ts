import { Controller, Get, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  GRPCHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Request } from 'express';
import { AUTH_SERVICE_NAME, protobufPackage } from 'src/auth/auth.pb';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private configService: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private grpc: GRPCHealthIndicator,
  ) {}

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

  @Get('http')
  @HealthCheck()
  checkHttp(@Req() request: Request) {
    console.log(request.body.requestId);
    return this.health.check([
      () =>
        this.http.pingCheck(
          'gateway',
          this.configService.get<string>('HEALTH_HTTP_URL'),
        ),
    ]);
  }
}
