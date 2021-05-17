import { JwtDataAdministratorDto } from 'src/dtos/administrator/jwt.data.administrator.dto';
import { JwtDataCustomerDto } from 'src/dtos/customer/jwt.data.customer.dto';

declare module 'express' {
  interface Request {
    token: JwtDataAdministratorDto | JwtDataCustomerDto;
  }
}
