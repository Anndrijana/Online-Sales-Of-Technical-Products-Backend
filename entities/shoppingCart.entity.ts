import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Order } from './order.entity';
import { ProductShoppingCart } from './product-shoppingCart.entity';

@Index('fk_shopping_cart_customer_id', ['customerId'], {})
@Entity('shopping_cart', { schema: 'technical_products_store' })
export class ShoppingCart {
  @PrimaryGeneratedColumn({ type: 'int', name: 'cart_id', unsigned: true })
  cartId: number;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('int', { name: 'customer_id', unsigned: true, default: () => "'0'" })
  customerId: number;

  @OneToOne(() => Order, (order) => order.cart)
  order: Order;

  @OneToMany(
    () => ProductShoppingCart,
    (productShoppingCart) => productShoppingCart.cart,
  )
  productShoppingCarts: ProductShoppingCart[];

  @ManyToOne(() => Customer, (customer) => customer.shoppingCarts, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'customerId' }])
  customer: Customer;
}
