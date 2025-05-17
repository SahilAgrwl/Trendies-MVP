import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body()
    data: {
      productId: number;
      buyerName: string;
      paymentMethod: string;
    },
  ): Promise<Order> {
    return this.ordersService.create(data);
  }
} 