export class LoginInformationAdministratorDto {
  administratorId: number;
  username: string;
  token: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;

  constructor(
    administratorId: number,
    username: string,
    jwt: string,
    refreshToken: string,
    refreshTokenExpiresAt: string,
  ) {
    this.administratorId = administratorId;
    this.username = username;
    this.token = jwt;
    this.refreshToken = refreshToken;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
  }
}
