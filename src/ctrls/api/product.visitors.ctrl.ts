import { Body, Controller, Post } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Product } from 'entities/product.entity';
import { ProductSearchDto } from 'src/dtos/product/search.dto';
import { ApiResponse } from 'src/other/api.response';
import { ProductVisitorsService } from 'src/services/productVisitors/productVisitors.service';

@Controller('visitor/product')
@Crud({
  model: {
    type: Product,
  },
  params: {
    id: {
      field: 'productId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      category: {
        eager: true,
      },
      images: {
        eager: true,
      },
      prices: {
        eager: true,
      },
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
export class ProductVisitorsController {
  constructor(public service: ProductVisitorsService) {}

  @Post('search')
  async search(
    @Body() data: ProductSearchDto,
  ): Promise<Product[] | ApiResponse> {
    return await this.service.search(data);
  }
}
