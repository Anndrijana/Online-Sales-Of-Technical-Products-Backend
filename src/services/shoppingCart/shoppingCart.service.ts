import { Product } from 'entities/product.entity';
import { ShoppingCart } from './../../../entities/shoppingCart.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { AddingShoppingCartDto } from 'src/dtos/shoppingCart/adding.shoppingCart.dto';
import { ApiResponse } from 'src/other/api.response';
import { ProductShoppingCart } from 'entities/product-shoppingCart.entity';
import { Order } from 'entities/order.entity';

@Injectable()
export class ShoppingCartService extends TypeOrmCrudService<ShoppingCart> {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly shoppingCart: Repository<ShoppingCart>,
    @InjectRepository(ProductShoppingCart)
    private readonly productShoppingCart: Repository<ProductShoppingCart>,
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    @InjectRepository(Order)
    private readonly order: Repository<Order>,
  ) {
    super(shoppingCart);
  }

  async createNewShoppingCart(id: number): Promise<ShoppingCart> {
    const newShoppingCart: ShoppingCart = new ShoppingCart();
    newShoppingCart.customerId = id;
    return await this.shoppingCart.save(newShoppingCart);
  }

  async currentCartByUserId(id: number): Promise<ShoppingCart | null> {
    const shoppingCarts = await this.shoppingCart.find({
      where: {
        customerId: id,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 1,
      relations: ['order'],
    });

    if (!shoppingCarts || shoppingCarts.length === 0) {
      return null;
    }

    const lastCart = shoppingCarts[0];

    if (lastCart.order !== null) {
      return null;
    }

    return lastCart;
  }

  async addProductToCustomerShoppingCart(
    shoppingCartId: number,
    productId: number,
    quantity: number,
  ): Promise<ShoppingCart> {
    let note: ProductShoppingCart = await this.productShoppingCart.findOne({
      cartId: shoppingCartId,
      productId: productId,
    });

    if (!note) {
      note = new ProductShoppingCart();
      note.cartId = shoppingCartId;
      note.productId = productId;
      note.quantity = quantity;
    } else {
      note.quantity += quantity;
    }

    await this.productShoppingCart.save(note);

    return this.getById(shoppingCartId);
  }

  async getById(shoppingCartId: number): Promise<ShoppingCart> {
    return await this.shoppingCart.findOne(shoppingCartId, {
      relations: [
        'customer',
        'productShoppingCarts',
        'productShoppingCarts.product',
        'productShoppingCarts.product.category',
        'productShoppingCarts.product.prices',
        'productShoppingCarts.product.images',
      ],
    });
  }

  async changeQuantity(
    shoppingCartId: number,
    productId: number,
    newQuantity: number,
  ): Promise<ShoppingCart> {
    const note: ProductShoppingCart = await this.productShoppingCart.findOne({
      cartId: shoppingCartId,
      productId: productId,
    });

    if (note) {
      note.quantity = newQuantity;

      if (note.quantity === 0) {
        await this.productShoppingCart.delete(note.productCartId);
      } else {
        await this.productShoppingCart.save(note);
      }
    }

    return await this.getById(shoppingCartId);
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
