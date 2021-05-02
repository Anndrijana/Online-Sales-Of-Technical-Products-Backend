export class ApiResponse {
  status: string;
  statusCode: number;

  constructor(status: string, statusCode: number) {
    this.status = status;
    this.statusCode = statusCode;
  }
}
