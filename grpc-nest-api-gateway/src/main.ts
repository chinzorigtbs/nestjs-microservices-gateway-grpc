import { NestFactory } from '@nestjs/core';
import { AppModule, Log } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Log(),
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Microservices')
    .setDescription('NestJS microservices swagger documentation')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [AuthModule, HealthModule, OrderModule, ProductModule],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.GATEWAY_PORT || 3000);
}

bootstrap();
