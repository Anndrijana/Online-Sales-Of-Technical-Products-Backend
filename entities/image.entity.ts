import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Index('uq_image_image_path', ['imagePath'], { unique: true })
@Index('fk_image_product_id', ['productId'], {})
@Entity('image', { schema: 'technical_products_store' })
export class Image {
  @PrimaryGeneratedColumn({ type: 'int', name: 'image_id', unsigned: true })
  imageId: number;

  @Column('varchar', {
    name: 'caption_image',
    length: 64,
    default: () => "'0'",
  })
  captionImage: string;

  @Column('varchar', {
    name: 'image_path',
    unique: true,
    length: 255,
    default: () => "'0'",
  })
  imagePath: string;

  @Column('int', { name: 'product_id', unsigned: true, default: () => "'0'" })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'productId' }])
  product: Product;
}
