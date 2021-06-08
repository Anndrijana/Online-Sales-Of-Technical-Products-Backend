import * as Validator from 'class-validator';

export class CustomerRegistrationDto {
  @Validator.IsNotEmpty()
  email: string;
  @Validator.IsNotEmpty()
  password: string;
  @Validator.IsNotEmpty()
  forename: string;
  @Validator.IsNotEmpty()
  surname: string;
  @Validator.IsNotEmpty()
  phoneNumber: string;
  @Validator.IsNotEmpty()
  address: string;
  @Validator.IsNotEmpty()
  city: string;
  @Validator.IsNotEmpty()
  postalAddress: string;
}
