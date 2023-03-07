import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_PACKAGE_NAME, ORDER_SERVICE_NAME } from './order.pb';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ORDER_SERVICE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('ORDER_CLIENT_URL'),
            package: ORDER_PACKAGE_NAME,
            protoPath: configService.get<string>('ORDER_CLIENT_PROTO_PATH'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrderController],
})
export class OrderModule {}
