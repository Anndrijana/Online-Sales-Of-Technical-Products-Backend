import { AddingShoppingCartDto } from 'src/dtos/shoppingCart/adding.shoppingCart.dto';
import { Body, Controller, Put } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ShoppingCart } from 'entities/shoppingCart.entity';
import { ShoppingCartService } from 'src/services/shoppingCart/shoppingCart.service';
import { ApiResponse } from 'src/other/api.response';

@Controller('api/shoppingCart')
@Crud({
  model: {
    type: ShoppingCart,
  },
  params: {
    id: {
      field: 'shoppingCartId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {},
  },
})
export class ShoppingCartController {
  constructor(public service: ShoppingCartService) {}

  @Put()
  addProduct(
    @Body() data: AddingShoppingCartDto,
  ): Promise<ShoppingCart | ApiResponse> {
    return this.service.add(data);
  }
}
