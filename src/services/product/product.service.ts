import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Price } from 'entities/price.entity';
import { ProductFeature } from 'entities/product-feature.entity';
import { Product } from 'entities/product.entity';
import { ApiResponse } from 'src/other/api.response';
import { AddingProductDto } from 'src/dtos/product/adding.product.dto';
import { DeleteResult, Repository } from 'typeorm';
import { EditingProductDto } from 'src/dtos/product/editing.product.dto';

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

  async editProduct(
    productId: number,
    data: EditingProductDto,
  ): Promise<Product | ApiResponse> {
    const currentProduct: Product = await this.product.findOne(productId, {
      relations: ['prices', 'productFeatures'],
    });

    if (!currentProduct) {
      return new ApiResponse('error', -5001, 'Article not found.');
    }

    currentProduct.productName = data.name;
    currentProduct.shortDesc = data.shortDescription;
    currentProduct.detailedDesc = data.detailedDescription;
    currentProduct.productStatus = data.status;
    currentProduct.isPromoted = data.isPromoted;
    currentProduct.productAmount = data.amount;
    currentProduct.categoryId = data.categoryId;

    const savedProduct = await this.product.save(currentProduct);
    if (!savedProduct) {
      return new ApiResponse(
        'error',
        -5002,
        'Could not save new article data.',
      );
    }

    const newPriceString: string = Number(data.price).toFixed(2);
    const lastPrice =
      currentProduct.prices[currentProduct.prices.length - 1].price;
    const lastPriceString: string = Number(lastPrice).toFixed(2);

    if (newPriceString !== lastPriceString) {
      const newProductPrice = new Price();
      newProductPrice.productId = productId;
      newProductPrice.price = data.price;

      const savedProductPrice = await this.price.save(newProductPrice);
      if (!savedProductPrice) {
        return new ApiResponse(
          'error',
          -5003,
          'Could not save the new article price.',
        );
      }
    }

    if (data.features !== null) {
      await this.productFeature.remove(currentProduct.productFeatures);

      for (const feature of data.features) {
        const newProductFeature: ProductFeature = new ProductFeature();
        newProductFeature.productId = productId;
        newProductFeature.featureId = feature.featureId;
        newProductFeature.value = feature.value;

        await this.productFeature.save(newProductFeature);
      }
    }

    return await this.product.findOne(productId, {
      relations: ['category', 'features', 'productFeatures', 'prices'],
    });
  }

  async delete(id: number): Promise<DeleteResult | ApiResponse> {
    const currentProduct: Product = await this.product.findOne(id);

    if (currentProduct === undefined) {
      return new Promise((resolve) => {
        resolve(
          new ApiResponse(
            'error',
            -3001,
            'Proizvod sa traženim id-jem ne postoji!',
          ),
        );
      });
    }

    return await this.product.delete(id);
  }
}
