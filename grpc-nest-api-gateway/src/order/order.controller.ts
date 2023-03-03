import {
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  ORDER_SERVICE_NAME,
  OrderServiceClient,
} from './order.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard, IRequest } from 'src/auth/auth.guard';
import { Observable } from 'rxjs';
import { Log } from 'src/app.module';

@Controller('order')
export class OrderController implements OnModuleInit {
  private service: OrderServiceClient;
  private readonly logger: Log = new Log(OrderController.name);

  constructor(
    @Inject(ORDER_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.service =
      this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private async createOrder(
    @Req() req: IRequest,
  ): Promise<Observable<CreateOrderResponse>> {
    const body: CreateOrderRequest = req.body;

    body.userId = <number>req.user;

    this.logger.debug('CreateOrderRequest', body);
    return this.service.createOrder(body);
  }
}
