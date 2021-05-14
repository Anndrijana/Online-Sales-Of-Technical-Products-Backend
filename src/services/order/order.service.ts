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
