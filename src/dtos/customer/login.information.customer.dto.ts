export class LoginInformationCustomerDto {
  customerId: number;
  username: string;
  token: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;

  constructor(
    customerId: number,
    username: string,
    jwt: string,
    refreshToken: string,
    refreshTokenExpiresAt: string,
  ) {
    this.customerId = customerId;
    this.username = username;
    this.token = jwt;
    this.refreshToken = refreshToken;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
  }
}
