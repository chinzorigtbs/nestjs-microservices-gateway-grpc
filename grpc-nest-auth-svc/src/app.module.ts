import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'micro_auth',
      username: 'chinzorigdorjderem',
      password: null,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
