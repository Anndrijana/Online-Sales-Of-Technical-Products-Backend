export class AddingProductDto {
  name: string;
  shortDescription: string;
  detailedDescription: string;
  amount: number;
  categoryId: number;
  price: number;
  features: {
    featureId: number;
    value: string;
  }[];
}
