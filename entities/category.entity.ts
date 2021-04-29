import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feature } from './feature.entity';
import { Product } from './product.entity';

@Index('uq_category_category_name', ['categoryName'], { unique: true })
@Index('uq_category_image_path', ['imagePath'], { unique: true })
@Index('fk_category_parent__category_id', ['parentCategoryId'], {})
@Entity('category', { schema: 'technical_products_store' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', name: 'category_id', unsigned: true })
  categoryId: number;

  @Column('varchar', {
    name: 'category_name',
    unique: true,
    length: 32,
    default: () => "'0'",
  })
  categoryName: string;

  @Column('varchar', {
    name: 'image_path',
    unique: true,
    length: 255,
    default: () => "'0'",
  })
  imagePath: string;

  @Column('int', {
    name: 'parent__category_id',
    nullable: true,
    unsigned: true,
  })
  parentCategoryId: number | null;

  @ManyToOne(() => Category, (category) => category.categories, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'parent__category_id', referencedColumnName: 'categoryId' },
  ])
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  categories: Category[];

  @OneToMany(() => Feature, (feature) => feature.category)
  features: Feature[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
