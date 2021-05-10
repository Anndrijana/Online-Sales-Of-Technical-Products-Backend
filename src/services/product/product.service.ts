import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Price } from 'entities/price.entity';
import { ProductFeature } from 'entities/product-feature.entity';
import { Product } from 'entities/product.entity';
import { ApiResponse } from 'src/response/api.response';
import { AddingProductDto } from 'src/dtos/product/adding.product.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,

    @InjectRepository(Price)
    private readonly price: Repository<Price>,

    @InjectRepository(ProductFeature)
    private readonly productFeature: Repository<ProductFeature>,
  ) {
    super(product);
  }

  async add(data: AddingProductDto): Promise<Product | ApiResponse> {
    const newProduct: Product = new Product();
    newProduct.productName = data.name;
    newProduct.shortDesc = data.shortDescription;
    newProduct.detailedDesc = data.detailedDescription;
    newProduct.productAmount = data.amount;
    newProduct.categoryId = data.categoryId;

    const savedProduct = await this.product.save(newProduct);

    const newPrice: Price = new Price();
    newPrice.productId = savedProduct.productId;
    newPrice.price = data.price;

    await this.price.save(newPrice);

    for (const feature of data.features) {
      const newProductFeature: ProductFeature = new ProductFeature();
      newProductFeature.productId = savedProduct.productId;
      newProductFeature.featureId = feature.featureId;
      newProductFeature.value = feature.value;

      await this.productFeature.save(newProductFeature);
    }

    return await this.product.findOne(savedProduct.productId, {
      relations: ['category', 'productFeatures', 'prices'],
    });
  }
}
