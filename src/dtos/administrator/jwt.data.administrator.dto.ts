export class JwtDataAdministratorDto {
  id: number;
  identity: string;
  exp: number;
  ip: string;
  ua: string;

  toPlainObject() {
    return {
      id: this.id,
      identity: this.identity,
      exp: this.exp,
      ip: this.ip,
      ua: this.ua,
    };
  }
}
