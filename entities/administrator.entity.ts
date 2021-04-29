import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('uq_administrator_username', ['username'], { unique: true })
@Entity('administrator', { schema: 'technical_products_store' })
export class Administrator {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'administrator_id',
    unsigned: true,
  })
  administratorId: number;

  @Column('varchar', {
    name: 'username',
    unique: true,
    length: 32,
    default: () => "'0'",
  })
  username: string;

  @Column('varchar', {
    name: 'password_hash',
    length: 128,
    default: () => "'0'",
  })
  passwordHash: string;

  @Column('tinyint', { name: 'is_active', width: 1, default: () => "'0'" })
  isActive: boolean;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
