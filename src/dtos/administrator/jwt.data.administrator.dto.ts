export class JwtDataAdministratorDto {
  administratorId: number;
  username: string;
  expiryDate: number;
  ipAddress: string;
  userAgent: string;

  toPlainObject() {
    return {
      id: this.administratorId,
      identity: this.username,
      exp: this.expiryDate,
      ip: this.ipAddress,
      ua: this.userAgent,
    };
  }
}
