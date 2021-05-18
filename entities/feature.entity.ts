import { Product } from './product.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductFeature } from './product-feature.entity';

@Index('uq_feature_feature_name_category_id', ['featureName', 'categoryId'], {
  unique: true,
})
@Index('fk_feature_category_id', ['categoryId'], {})
@Entity('feature', { schema: 'technical_products_store' })
export class Feature {
  @PrimaryGeneratedColumn({ type: 'int', name: 'feature_id', unsigned: true })
  featureId: number;

  @Column('varchar', { name: 'feature_name', length: 32, default: () => "'0'" })
  featureName: string;

  @Column('int', { name: 'category_id', unsigned: true, default: () => "'0'" })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.features, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'categoryId' }])
  category: Category;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => Product, (product) => product.features)
  @JoinTable({
    name: 'product_feature',
    joinColumn: { name: 'feature_id', referencedColumnName: 'featureId' },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'productId',
    },
  })
  products: Product[];

  @OneToMany(() => ProductFeature, (productFeature) => productFeature.feature)
  productFeatures: ProductFeature[];
}
