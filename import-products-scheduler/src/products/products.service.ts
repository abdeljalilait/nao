// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel
      .aggregate([
        {
          $group: {
            _id: '$docId',
            products: {
              $push: {
                docId: '$docId',
                fullData: '$fullData',
                data: '$data',
                dataPublic: '$dataPublic',
                immutable: '$immutable',
                deploymentId: '$deploymentId',
                docType: '$docType',
                namespace: '$namespace',
                companyId: '$companyId',
                status: '$status',
                info: '$info',
              },
            },
          },
        },
      ])
      .exec();
  }
}
