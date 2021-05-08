export class LoginInformationAdministratorDto {
  id: number;
  username: string;
  jwt: string;

  constructor(administratorId: number, username: string, token: string) {
    this.id = administratorId;
    this.username = username;
    this.jwt = token;
  }
}
