import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('administrator_token', { schema: 'technical_products_store' })
export class AdministratorToken {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'token_id',
    unsigned: true,
  })
  tokenId: number;

  @Column({ type: 'int', name: 'administrator_id', unsigned: true })
  administratorId: number;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'datetime', name: 'exp' })
  exp: string;

  @Column({ type: 'tinyint', name: 'is_valid', default: 1 })
  isValid: number;
}
