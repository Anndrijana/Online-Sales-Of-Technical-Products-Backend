import { AddingShoppingCartDto } from 'src/dtos/shoppingCart/adding.shoppingCart.dto';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ShoppingCart } from 'entities/shoppingCart.entity';
import { ShoppingCartService } from 'src/services/shoppingCart/shoppingCart.service';
import { ApiResponse } from 'src/other/api.response';
import { RolesGuard } from 'src/other/role.checker.guard';
import { AllowToRoles } from 'src/other/allow.to.role.descriptor';
import { Request } from 'express';
import { AddingAndEditingProductToShoppingCartDto } from 'src/dtos/shoppingCart/adding.editing.product.to.shopping.cart.dto';
import { Order } from 'entities/order.entity';
import { OrderService } from 'src/services/order/order.service';

@Controller('api/shoppingCart')
@UseGuards(RolesGuard)
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
  constructor(
    public service: ShoppingCartService,
    public orderService: OrderService,
  ) {}

  private async getLastActiveCartForCustomerId(
    customerId: number,
  ): Promise<ShoppingCart> {
    let cart = await this.service.currentCartByUserId(customerId);

    if (!cart) {
      cart = await this.service.createNewShoppingCart(customerId);
    }

    return await this.service.getById(cart.cartId);
  }

  @Get()
  @AllowToRoles('customer')
  async getCurrentShoppingCart(@Req() req: Request): Promise<ShoppingCart> {
    return await this.getLastActiveCartForCustomerId(req.token.id);
  }

  @Post('addToShoppingCart')
  @AllowToRoles('customer')
  async addProductToShoppingCart(
    @Body() data: AddingAndEditingProductToShoppingCartDto,
    @Req() req: Request,
  ): Promise<ShoppingCart> {
    const shoppingCart = await this.getLastActiveCartForCustomerId(
      req.token.id,
    );
    return await this.service.addProductToCustomerShoppingCart(
      shoppingCart.cartId,
      data.productId,
      data.quantity,
    );
  }

  @Patch()
  @AllowToRoles('customer')
  async changeQuantity(
    @Body() data: AddingAndEditingProductToShoppingCartDto,
    @Req() req: Request,
  ): Promise<ShoppingCart> {
    const shoppingCart = await this.getLastActiveCartForCustomerId(
      req.token.id,
    );
    return await this.service.changeQuantity(
      shoppingCart.cartId,
      data.productId,
      data.quantity,
    );
  }

  @Post('createOrder')
  @AllowToRoles('customer')
  async createOrder(@Req() req: Request): Promise<Order | ApiResponse> {
    const shoppingCart = await this.getLastActiveCartForCustomerId(
      req.token.id,
    );
    const order = await this.orderService.createOrder(shoppingCart.cartId);

    if (order instanceof ApiResponse) {
      return order;
    }

    return order;
  }

  @Put()
  addProduct(
    @Body() data: AddingShoppingCartDto,
  ): Promise<ShoppingCart | ApiResponse> {
    return this.service.add(data);
  }

  @Get('orders')
  @AllowToRoles('customer')
  async getCustomerOrders(@Req() req: Request): Promise<Order[]> {
    return await this.orderService.getAllOrdersByCustomerId(req.token.id);
  }
}
