import { Controller, Inject } from '@nestjs/common';
import { OrderService } from './order.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateOrderResponse, ORDER_SERVICE_NAME } from './proto/order.pb';
import { CreateOrderRequestDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(@Inject(OrderService) private readonly service: OrderService) {}

  @GrpcMethod(ORDER_SERVICE_NAME, 'CreateOrder')
  private async createOrder(
    payload: CreateOrderRequestDto,
  ): Promise<CreateOrderResponse> {
    return this.service.createOrder(payload);
  }
}
