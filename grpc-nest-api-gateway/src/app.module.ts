import {
  ConsoleLogger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { RequestMiddleware } from './request.middleware';

export class Log extends ConsoleLogger {
  debug(message: string, parameter?: any): void {
    parameter =
      typeof parameter !== 'string' ? JSON.stringify(parameter) : parameter;
    super.debug(message + ': ' + parameter);
  }
  error(message: string, parameter?: any): void {
    parameter =
      typeof parameter !== 'string' ? JSON.stringify(parameter) : parameter;
    super.error(message + '\nCaused by: ' + parameter);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['./.env.local'] }),
    AuthModule,
    ProductModule,
    OrderModule,
    HealthModule,
  ],
  providers: [Log],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
