export class JwtDataAdministratorDto {
  role: 'administrator';
  id: number;
  identity: string;
  exp: number;
  ip: string;
  ua: string;

  toPlainObject() {
    return {
      role: this.role,
      id: this.id,
      username: this.identity,
      exp: this.exp,
      ip: this.ip,
      ua: this.ua,
    };
  }
}
