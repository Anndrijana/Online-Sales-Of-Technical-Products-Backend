import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Image } from './image.entity';
import { Price } from './price.entity';
import { Category } from './category.entity';
import { ProductFeature } from './product-feature.entity';
import { ProductShoppingCart } from './product-shoppingCart.entity';
import { Feature } from './feature.entity';

@Index('fk_product_category_id', ['categoryId'], {})
@Entity('product', { schema: 'technical_products_store' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'product_id', unsigned: true })
  productId: number;

  @Column('varchar', { name: 'product_name', length: 64, default: () => "'0'" })
  productName: string;

  @Column('varchar', { name: 'short_desc', length: 255, default: () => "'0'" })
  shortDesc: string;

  @Column('text', { name: 'detailed_desc' })
  detailedDesc: string;

  @Column('enum', {
    name: 'product_status',
    enum: ['available', 'visible', 'hidden'],
    default: () => "'available'",
  })
  productStatus: 'available' | 'visible' | 'hidden';

  @Column('tinyint', {
    name: 'is_promoted',
    unsigned: true,
    default: () => "'0'",
  })
  isPromoted: number;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('int', { name: 'product_amount', default: () => "'0'" })
  productAmount: number;

  @Column('int', { name: 'category_id', unsigned: true, default: () => "'0'" })
  categoryId: number;

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(() => Price, (price) => price.product)
  prices: Price[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'categoryId' }])
  category: Category;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => Feature, (feature) => feature.products)
  @JoinTable({
    name: 'product_feature',
    joinColumn: { name: 'product_id', referencedColumnName: 'productId' },
    inverseJoinColumn: {
      name: 'feature_id',
      referencedColumnName: 'featureId',
    },
  })
  features: Feature[];

  @OneToMany(() => ProductFeature, (productFeature) => productFeature.product)
  productFeatures: ProductFeature[];

  @OneToMany(
    () => ProductShoppingCart,
    (productShoppingCart) => productShoppingCart.product,
  )
  productShoppingCarts: ProductShoppingCart[];
}
