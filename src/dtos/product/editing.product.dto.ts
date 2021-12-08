export class EditingProductDto {
  productName: string;
  shortDesc: string;
  detailedDesc: string;
  productStatus: 'available' | 'visible' | 'hidden';
  isPromoted: 0 | 1;
  categoryId: number;
  price: number;
  productAmount: number;
  /*features:
    | {
        featureId: number;
        value: string;
      }[]
    | null;*/
}
