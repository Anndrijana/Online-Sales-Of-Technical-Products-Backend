import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShoppingCart } from './shoppingCart.entity';

@Index('uq_customer_email', ['email'], { unique: true })
@Index('uq_customer_phone_number', ['phoneNumber'], { unique: true })
@Entity('customer', { schema: 'technical_products_store' })
export class Customer {
  @PrimaryGeneratedColumn({ type: 'int', name: 'customer_id', unsigned: true })
  customerId: number;

  @Column('varchar', { name: 'forename', length: 32, default: () => "'0'" })
  forename: string;

  @Column('varchar', { name: 'surname', length: 32, default: () => "'0'" })
  surname: string;

  @Column('varchar', {
    name: 'phone_number',
    unique: true,
    length: 24,
    default: () => "'0'",
  })
  phoneNumber: string;

  @Column('tinytext', { name: 'address' })
  address: string;

  @Column('varchar', { name: 'city', length: 64, default: () => "'0'" })
  city: string;

  @Column('varchar', {
    name: 'postal_address',
    length: 5,
    default: () => "'0'",
  })
  postalAddress: string;

  @Column('varchar', {
    name: 'email',
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  email: string;

  @Column('varchar', {
    name: 'password_hash',
    length: 128,
    default: () => "'0'",
  })
  passwordHash: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('tinyint', { name: 'is_active', width: 1, default: () => "'0'" })
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
}
