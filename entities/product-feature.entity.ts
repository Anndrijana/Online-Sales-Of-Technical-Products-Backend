import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feature } from './feature.entity';
import { Product } from './product.entity';

@Index('uq_product_feature_product_id_feature_id', ['productId', 'featureId'], {
  unique: true,
})
@Index('fk_product_feature_feature_id', ['featureId'], {})
@Entity('product_feature', { schema: 'technical_products_store' })
export class ProductFeature {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'product_feature_id',
    unsigned: true,
  })
  productFeatureId: number;

  @Column('int', { name: 'product_id', unsigned: true, default: () => "'0'" })
  productId: number;

  @Column('int', { name: 'feature_id', unsigned: true, default: () => "'0'" })
  featureId: number;

  @Column('varchar', { name: 'value', length: 255, default: () => "'0'" })
  value: string;

  @ManyToOne(() => Feature, (feature) => feature.productFeatures, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'feature_id', referencedColumnName: 'featureId' }])
  feature: Feature;

  @ManyToOne(() => Product, (product) => product.productFeatures, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'product_id', referencedColumnName: 'productId' }])
  product: Product;
}
