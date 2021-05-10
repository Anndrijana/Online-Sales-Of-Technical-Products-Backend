export class LoginInformationAdministratorDto {
  administratorId: number;
  username: string;
  token: string;

  constructor(administratorId: number, username: string, jwt: string) {
    this.administratorId = administratorId;
    this.username = username;
    this.token = jwt;
  }
}
