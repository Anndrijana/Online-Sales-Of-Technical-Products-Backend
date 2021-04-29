import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingCart } from './shoppingCart.entity';
import { Product } from './product.entity';

@Index('uq_product_shopping_cart_product_id_cart_id', ['productId', 'cartId'], {
  unique: true,
})
@Index('fk_product_shopping_cart_cart_id', ['cartId'], {})
@Entity('product_shopping_cart', { schema: 'technical_products_store' })
export class ProductShoppingCart {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'product_cart_id',
    unsigned: true,
  })
  productCartId: number;

  @Column('int', { name: 'quantity', unsigned: true, default: () => "'0'" })
  quantity: number;

  @Column('int', { name: 'product_id', unsigned: true, default: () => "'0'" })
  productId: number;

  @Column('int', { name: 'cart_id', unsigned: true, default: () => "'0'" })
  cartId: number;

  @ManyToOne(
    () => ShoppingCart,
    (shoppingCart) => shoppingCart.productShoppingCarts,
    { onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'cart_id', referencedColumnName: 'cartId' }])
  cart: ShoppingCart;

  @ManyToOne(() => Product, (product) => product.productShoppingCarts, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'productId' }])
  product: Product;
}
