export class JwtDataRefreshCustomerDto {
  role: 'customer';
  id: number;
  identity: string;
  exp: number;
  ip: string;
  ua: string;

  toPlainObject() {
    return {
      role: this.role,
      id: this.id,
      email: this.identity,
      exp: this.exp,
      ip: this.ip,
      ua: this.ua,
    };
  }
}
