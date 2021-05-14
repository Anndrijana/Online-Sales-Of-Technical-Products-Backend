export class AddingAndEditingOrderDto {
  orderStatus: 'accepted' | 'rejected' | 'shipped' | 'unresolved';
  cartId: number;
}
