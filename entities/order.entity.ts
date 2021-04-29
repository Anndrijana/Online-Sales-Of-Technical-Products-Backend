import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingCart } from './shoppingCart.entity';

@Index('uq_order_cart_id', ['cartId'], { unique: true })
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
}
