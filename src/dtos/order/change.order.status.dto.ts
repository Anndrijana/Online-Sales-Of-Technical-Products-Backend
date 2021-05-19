export class ChangeOrderStatusDto {
  newStatus: 'rejected' | 'accepted' | 'shipped' | 'unresolved';
}
