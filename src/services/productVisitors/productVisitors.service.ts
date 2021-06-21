import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Product } from 'entities/product.entity';
import { ProductSearchDto } from 'src/dtos/product/search.dto';
import { ApiResponse } from 'src/other/api.response';
import { Repository } from 'typeorm';

@Injectable()
export class ProductVisitorsService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
  ) {
    super(product);
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
        'No products found for these search parameters.',
      );
    }

    return products;
  }
}
