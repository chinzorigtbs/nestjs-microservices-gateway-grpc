import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_PACKAGE_NAME, PRODUCT_SERVICE_NAME } from './product.pb';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PRODUCT_SERVICE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('PRODUCT_CLIENT_URL'),
            package: PRODUCT_PACKAGE_NAME,
            protoPath: configService.get<string>('PRODUCT_CLIENT_PROTO_PATH'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductController],
})
export class ProductModule {}
