import * as Validator from 'class-validator';

export class LoginCustomerDto {
  @Validator.IsNotEmpty()
  email: string;
  @Validator.IsNotEmpty()
  password: string;
}
