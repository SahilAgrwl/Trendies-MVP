import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    status?: string;
  }): Promise<Product[]> {
    const { skip, take, status } = params;
    const where: Prisma.ProductWhereInput = {};
    
    if (status) {
      where.status = status;
    }
    
    return this.prisma.product.findMany({
      skip,
      take,
      where,
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async count(status?: string): Promise<number> {
    const where: Prisma.ProductWhereInput = {};
    
    if (status) {
      where.status = status;
    }
    
    return this.prisma.product.count({ where });
  }
} 