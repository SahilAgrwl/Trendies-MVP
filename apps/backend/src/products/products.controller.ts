import { Controller, Get, Post, Body, Param, Put, Query, ParseIntPipe, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product, Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';
import * as fs from 'fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ): Promise<{ products: Product[]; total: number; pages: number }> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 5;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      this.productsService.findAll({
        skip,
        take: limitNum,
        status,
      }),
      this.productsService.count(status),
    ]);

    return {
      products,
      total,
      pages: Math.ceil(total / limitNum),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() data: Prisma.ProductCreateInput): Promise<Product> {
    return this.productsService.create(data);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads');
          // Ensure directory exists
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generate a unique filename with original extension
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        // Allow only images
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadProduct(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<Product> {
    // Get the server URL for creating the image URL
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/${file.filename}`;

    // Extract form data
    const { title, price, category, description, sellerName, sellerEmail, status } = req.body;

    // Create the product with the image URL
    return this.productsService.create({
      title,
      price: parseFloat(price),
      category,
      description,
      imageUrl,
      sellerName,
      sellerEmail,
      status,
    });
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return this.productsService.update(id, data);
  }
} 