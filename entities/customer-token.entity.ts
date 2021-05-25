import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer_token', { schema: 'technical_products_store' })
export class CustomerToken {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'token_id',
    unsigned: true,
  })
  tokenId: number;

  @Column({ type: 'int', name: 'customer_id', unsigned: true })
  customerId: number;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'datetime', name: 'exp' })
  exp: string;

  @Column({ type: 'tinyint', name: 'is_valid', default: 1 })
  isValid: number;
}
