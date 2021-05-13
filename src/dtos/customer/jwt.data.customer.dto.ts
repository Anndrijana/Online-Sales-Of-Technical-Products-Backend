export class JwtDataCustomerDto {
  customerId: number;
  email: string;
  expiryDate: number;
  ipAddress: string;
  userAgent: string;

  toPlainObject() {
    return {
      id: this.customerId,
      email: this.email,
      exp: this.expiryDate,
      ip: this.ipAddress,
      ua: this.userAgent,
    };
  }
}
