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
import { ProductSearchDto } from 'src/dtos/product/search.dto';

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
    newProduct.productName = data.productName;
    newProduct.shortDesc = data.shortDesc;
    newProduct.detailedDesc = data.detailedDesc;
    newProduct.categoryId = data.categoryId;
    newProduct.productAmount = data.productAmount;

    const savedProduct = await this.product.save(newProduct);

    const newPrice: Price = new Price();
    newPrice.productId = savedProduct.productId;
    newPrice.price = data.price;

    await this.price.save(newPrice);

    /*for (const feature of data.features) {
      const newProductFeature: ProductFeature = new ProductFeature();
      newProductFeature.productId = savedProduct.productId;
      newProductFeature.featureId = feature.featureId;
      newProductFeature.value = feature.value;

      await this.productFeature.save(newProductFeature);
    }*/

    /*return await this.product.findOne(savedProduct.productId, {
      relations: ['category', 'productFeatures', 'prices'],
    });*/

    return await this.product.findOne(savedProduct.productId, {
      relations: ['category', 'prices'],
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
      return new ApiResponse('error', -5001, 'Product not found.');
    }

    currentProduct.productName = data.productName;
    currentProduct.shortDesc = data.shortDesc;
    currentProduct.detailedDesc = data.detailedDesc;
    currentProduct.productStatus = data.productStatus;
    currentProduct.isPromoted = data.isPromoted;
    currentProduct.categoryId = data.categoryId;
    currentProduct.productAmount = data.productAmount;

    const savedProduct = await this.product.save(currentProduct);
    if (!savedProduct) {
      return new ApiResponse(
        'error',
        -5002,
        'Could not save new product data.',
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
          'Could not save the new product price.',
        );
      }
    }

    /*if (data.features !== null) {
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
    });*/

    return await this.product.findOne(productId, {
      relations: ['category', 'prices'],
    });
  }

  async delete(id: number): Promise<DeleteResult | ApiResponse> {
    const currentProduct: Product = await this.product.findOne(id);

    if (currentProduct === undefined) {
      return new Promise((resolve) => {
        resolve(new ApiResponse('error', -3001, 'The product does not exist!'));
      });
    }

    return await this.product.delete(id);
  }

  async search(data: ProductSearchDto): Promise<Product[] | ApiResponse> {
    const builder = await this.product.createQueryBuilder('product');

    builder.innerJoinAndSelect(
      'product.prices',
      'ap',
      'ap.createdAt = (SELECT MAX(ap.created_at) FROM price AS ap WHERE ap.product_id = product.product_id)',
    );

    builder.leftJoinAndSelect('product.productFeatures', 'pf');
    builder.leftJoinAndSelect('product.features', 'features');
    builder.leftJoinAndSelect('product.images', 'images');

    builder.where('product.categoryId = :catId', { catId: data.categoryId });

    if (data.keywords && data.keywords.length > 0) {
      builder.andWhere(
        `(
          product.productName LIKE :kw OR
          product.shortDesc LIKE :kw OR
          product.detailedDesc LIKE :kw
                          )`,
        { kw: '%' + data.keywords.trim() + '%' },
      );
    }

    if (data.priceMin && typeof data.priceMin === 'number') {
      builder.andWhere('ap.price >= :min', { min: data.priceMin });
    }

    if (data.priceMax && typeof data.priceMax === 'number') {
      builder.andWhere('ap.price <= :max', { max: data.priceMax });
    }

    if (data.features && data.features.length > 0) {
      for (const feature of data.features) {
        builder.andWhere('af.featureId = :fId AND af.value IN (:fVals)', {
          fId: feature.featureId,
          fVals: feature.values,
        });
      }
    }

    let orderBy = 'product.productName';
    let orderDirection: 'ASC' | 'DESC' = 'ASC';

    if (data.orderBy) {
      orderBy = data.orderBy;

      if (orderBy === 'price') {
        orderBy = 'ap.price';
      }

      if (orderBy === 'name') {
        orderBy = 'product.productName';
      }
    }

    if (data.orderDirection) {
      orderDirection = data.orderDirection;
    }

    builder.orderBy(orderBy, orderDirection);

    let page = 0;
    let perPage: 5 | 10 | 15 | 20 | 25 | 30 = 15;

    if (data.page && typeof data.page === 'number') {
      page = data.page;
    }

    if (data.itemsPerPage && typeof data.itemsPerPage === 'number') {
      perPage = data.itemsPerPage;
    }

    builder.skip(page * perPage);
    builder.take(perPage);

    const products = await builder.getMany();

    if (products.length === 0) {
      return new ApiResponse(
        'Ok',
        0,
        'No products found for these search parameters!',
      );
    }

    return products;
  }
}
