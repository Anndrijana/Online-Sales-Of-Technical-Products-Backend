import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as Validator from 'class-validator';
import { ShoppingCart } from './shoppingCart.entity';
import { Order } from './order.entity';

@Index('uq_customer_email', ['email'], { unique: true })
@Index('uq_customer_phone_number', ['phoneNumber'], { unique: true })
@Entity('customer', { schema: 'technical_products_store' })
export class Customer {
  @PrimaryGeneratedColumn({ type: 'int', name: 'customer_id', unsigned: true })
  customerId: number;

  @Column('varchar', { name: 'forename', length: 32, default: () => "'0'" })
  @Validator.IsNotEmpty()
  forename: string;

  @Column('varchar', { name: 'surname', length: 32, default: () => "'0'" })
  @Validator.IsNotEmpty()
  surname: string;

  @Column('varchar', {
    name: 'phone_number',
    unique: true,
    length: 24,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  phoneNumber: string;

  @Column('tinytext', { name: 'address' })
  @Validator.IsNotEmpty()
  address: string;

  @Column('varchar', { name: 'city', length: 64, default: () => "'0'" })
  @Validator.IsNotEmpty()
  city: string;

  @Column('varchar', {
    name: 'postal_address',
    length: 5,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  postalAddress: string;

  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  email: string;

  @Column('varchar', {
    name: 'password_hash',
    length: 128,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  passwordHash: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('tinyint', { name: 'is_active', width: 1, default: () => "'1'" })
  isActive: boolean;

  @Column('varchar', {
    name: 'password_reset_link',
    nullable: true,
    length: 128,
    default: () => "'0'",
  })
  passwordResetLink: string | null;

  @OneToMany(() => ShoppingCart, (shoppingCart) => shoppingCart.customer)
  shoppingCarts: ShoppingCart[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
