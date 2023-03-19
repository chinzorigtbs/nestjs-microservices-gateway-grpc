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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('order')
@ApiTags('order endpoint')
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

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new order using this endpoint' })
  @ApiResponse({ status: 200, description: 'Order created' })
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
