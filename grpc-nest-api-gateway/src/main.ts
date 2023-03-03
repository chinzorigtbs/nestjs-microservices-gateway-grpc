import { NestFactory } from '@nestjs/core';
import { AppModule, Log } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Log(),
  });
  await app.listen(3000);
}
bootstrap();
