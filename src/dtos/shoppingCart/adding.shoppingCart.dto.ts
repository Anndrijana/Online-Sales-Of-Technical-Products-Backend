export class AddingShoppingCartDto {
  customerId: number;
  productShoppingCarts: {
    quantity: number;
    productId: number;
  }[];
}
