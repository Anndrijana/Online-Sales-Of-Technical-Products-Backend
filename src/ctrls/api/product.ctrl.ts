import { Body, Controller, Put } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Product } from 'entities/product.entity';
import { ApiResponse } from 'src/response/api.response';
import { AddingProductDto } from 'src/dtos/product/adding.product.dto';
import { ProductService } from 'src/services/product/product.service';

@Controller('api/product')
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
    join: {},
  },
})
export class ProductController {
  constructor(public service: ProductService) {}

  @Put()
  addProduct(@Body() data: AddingProductDto): Promise<Product | ApiResponse> {
    return this.service.add(data);
  }
}
