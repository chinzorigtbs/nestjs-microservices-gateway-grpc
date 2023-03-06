import { ConsoleLogger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { HealthModule } from './health/health.module';

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
  imports: [AuthModule, ProductModule, OrderModule, HealthModule],
  providers: [Log],
})
export class AppModule {}
