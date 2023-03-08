import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateProductRequest,
  CreateProductResponse,
  FindOneResponse,
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from './product.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/auth.guard';
import { Observable } from 'rxjs';
import { Log } from 'src/app.module';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductRequestDto } from './product.dto';

@Controller('product')
@ApiTags('product')
export class ProductController implements OnModuleInit {
  private service: ProductServiceClient;
  private readonly logger: Log = new Log();

  constructor(
    @Inject(PRODUCT_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.service =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard)
  private async createProduct(
    @Body() body: CreateProductRequestDto,
  ): Promise<Observable<CreateProductResponse>> {
    this.logger.debug('CreateProductRequest', body);
    return this.service.createProduct(body);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard)
  private async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Observable<FindOneResponse>> {
    this.logger.debug('FindOneRequest', id);
    return this.service.findOne({ id });
  }
}
