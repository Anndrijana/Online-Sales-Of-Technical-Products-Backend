export class EditingProductDto {
  name: string;
  shortDescription: string;
  detailedDescription: string;
  status: 'available' | 'visible' | 'hidden';
  isPromoted: 0 | 1;
  amount: number;
  categoryId: number;
  price: number;
  features:
    | {
        featureId: number;
        value: string;
      }[]
    | null;
}
