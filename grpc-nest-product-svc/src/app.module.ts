import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'micro_product',
      username: 'chinzorigdorjderem',
      password: null,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    ProductModule,
  ],
})
export class AppModule {}
