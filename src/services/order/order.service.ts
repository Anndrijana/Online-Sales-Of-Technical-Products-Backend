import { AddingAndEditingOrderDto } from '../../dtos/order/adding.editing.order';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'entities/order.entity';
import { ShoppingCart } from 'entities/shoppingCart.entity';
import { ApiResponse } from 'src/other/api.response';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly cart: Repository<ShoppingCart>,

    @InjectRepository(Order)
    private readonly order: Repository<Order>,
  ) {}

  async createOrder(cartId: number): Promise<Order | ApiResponse> {
    const order = await this.order.findOne({
      cartId: cartId,
    });

    if (order) {
      return new ApiResponse(
        'error',
        -7001,
        'An order for this cart has already been made.',
      );
    }

    const cart = await this.cart.findOne(cartId, {
      relations: ['productShoppingCarts'],
    });

    if (!cart) {
      return new ApiResponse('error', -7002, 'No such cart found.');
    }

    if (cart.productShoppingCarts.length === 0) {
      return new ApiResponse('error', -7003, 'This cart is empty.');
    }

    const newOrder: Order = new Order();
    newOrder.cartId = cartId;
    const savedOrder = await this.order.save(newOrder);

    cart.createdAt = new Date();
    await this.cart.save(cart);

    return await this.getById(savedOrder.orderId);
  }

  async getById(orderId: number) {
    return await this.order.findOne(orderId, {
      relations: [
        'cart',
        'cart.customer',
        'cart.productShoppingCarts',
        'cart.productShoppingCarts.product',
        'cart.productShoppingCarts.product.category',
        'cart.productShoppingCarts.product.prices',
      ],
    });
  }

  async add(data: AddingAndEditingOrderDto): Promise<Order | ApiResponse> {
    const newOrder: Order = new Order();
    newOrder.orderStatus = data.orderStatus;
    newOrder.cartId = data.cartId;

    const savedOrder = await this.order.save(newOrder);

    /*for (const cart of data.cart) {
      const newCart: ShoppingCart = new ShoppingCart();
      newCart.cartId = savedOrder.cartId;
      newCart.customerId = cart.customerId;

      await this.cart.save(newCart);
    }

    return await this.order.findOne(savedOrder.orderId, {
      relations: ['cart'],
    });*/
    return this.order.save(savedOrder);
  }

  async editById(
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: AddingAndEditingOrderDto,
  ): Promise<Order | ApiResponse> {
    const currentOrder: Order = await this.order.findOne(id);

    if (currentOrder === undefined) {
      return new Promise((resolve) => {
        resolve(
          new ApiResponse(
            'error',
            -3001,
            'Order sa traženim id-jem ne postoji!',
          ),
        );
      });
    }

    currentOrder.orderStatus = data.orderStatus;
    currentOrder.cartId = data.cartId;

    return this.order.save(currentOrder);
  }

  async delete(id: number): Promise<DeleteResult | ApiResponse> {
    const currentOrder: Order = await this.order.findOne(id);

    if (currentOrder === undefined) {
      return new Promise((resolve) => {
        resolve(
          new ApiResponse(
            'error',
            -3001,
            'Order sa traženim id-jem ne postoji!',
          ),
        );
      });
    }

    return await this.order.delete(id);
  }
}
