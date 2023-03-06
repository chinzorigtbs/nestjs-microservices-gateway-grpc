import { Controller, Get } from '@nestjs/common';
import { GrpcOptions } from '@nestjs/microservices';
import {
  GRPCHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AUTH_SERVICE_NAME, protobufPackage } from 'src/auth/auth.pb';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private grpc: GRPCHealthIndicator,
  ) {}

  @Get('http')
  @HealthCheck()
  checkHttp() {
    return this.health.check([
      () => this.http.pingCheck('gateway', 'http://localhost:9200'),
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
          { timeout: 2000 },
        ),
    ]);
  }
}
