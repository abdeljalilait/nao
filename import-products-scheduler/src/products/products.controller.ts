// product.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from '../schemas/product';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }
}
