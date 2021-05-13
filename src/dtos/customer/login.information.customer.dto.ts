export class LoginInformationCustomerDto {
  customerId: number;
  username: string;
  token: string;

  constructor(customerId: number, username: string, jwt: string) {
    this.customerId = customerId;
    this.username = username;
    this.token = jwt;
  }
}
