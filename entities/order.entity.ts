import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { ShoppingCart } from './shoppingCart.entity';

@Index('uq_order_cart_id', ['cartId'], {
  unique: true,
})
@Index('fk_order_customer_id', ['customerId'], {})
@Entity('order', { schema: 'technical_products_store' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', name: 'order_id', unsigned: true })
  orderId: number;

  @Column('enum', {
    name: 'order_status',
    enum: ['accepted', 'rejected', 'shipped', 'unresolved'],
    default: () => "'unresolved'",
  })
  orderStatus: 'accepted' | 'rejected' | 'shipped' | 'unresolved';

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('int', {
    name: 'cart_id',
    unique: true,
    unsigned: true,
    default: () => "'0'",
  })
  cartId: number;

  @OneToOne(() => ShoppingCart, (shoppingCart) => shoppingCart.order, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'cart_id', referencedColumnName: 'cartId' }])
  cart: ShoppingCart;

  @Column('int', { name: 'customer_id', unsigned: true, default: () => "'0'" })
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'customerId' }])
  customer: Customer;
}
