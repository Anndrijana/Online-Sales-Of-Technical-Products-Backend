import { ShoppingCart } from './../../../entities/shoppingCart.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { AddingShoppingCartDto } from 'src/dtos/shoppingCart/adding.shoppingCart.dto';
import { ApiResponse } from 'src/other/api.response';
import { ProductShoppingCart } from 'entities/product-shoppingCart.entity';

@Injectable()
export class ShoppingCartService extends TypeOrmCrudService<ShoppingCart> {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly shoppingCart: Repository<ShoppingCart>,
    @InjectRepository(ProductShoppingCart)
    private readonly productShoppingCart: Repository<ProductShoppingCart>,
  ) {
    super(shoppingCart);
  }

  async add(data: AddingShoppingCartDto): Promise<ShoppingCart | ApiResponse> {
    const newShoppingCart: ShoppingCart = new ShoppingCart();
    newShoppingCart.customerId = data.customerId;

    const savedShoppingCart = await this.shoppingCart.save(newShoppingCart);

    for (const psc of data.productShoppingCarts) {
      const newProductShoppingCart: ProductShoppingCart = new ProductShoppingCart();
      newProductShoppingCart.cartId = savedShoppingCart.cartId;
      newProductShoppingCart.quantity = psc.quantity;
      newProductShoppingCart.productId = psc.productId;

      await this.productShoppingCart.save(newProductShoppingCart);
    }

    return await this.shoppingCart.findOne(savedShoppingCart.cartId, {
      relations: ['productShoppingCarts'],
    });
  }
}
