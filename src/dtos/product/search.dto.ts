import { FeatureSearchComponentDto } from './feature.search.component.dto';

export class ProductSearchDto {
  categoryId: number;
  keywords: string;
  priceMin: number;
  priceMax: number;
  features: FeatureSearchComponentDto[];
  orderBy: 'name' | 'price';
  orderDirection: 'ASC' | 'DESC';
  page: number;
  itemsPerPage: 5 | 10 | 15 | 20 | 25 | 30;
}
