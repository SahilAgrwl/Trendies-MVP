import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async create(data: {
    productId: number;
    buyerName: string;
    paymentMethod: string;
  }): Promise<Order> {
    // Create the order
    const order = await this.prisma.order.create({
      data: {
        productId: data.productId,
        buyerName: data.buyerName,
        paymentMethod: data.paymentMethod,
      },
    });

    // Update the product status to sold
    await this.productsService.update(data.productId, {
      status: 'sold',
    });

    return order;
  }
} 