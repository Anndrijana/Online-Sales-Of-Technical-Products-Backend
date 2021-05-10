import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { resolve } from 'node:path';
import { ApiResponse } from 'src/response/api.response';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Customer } from 'entities/customer.entity';
import { AddingAndEditingCustomerDto } from 'src/dtos/customer/adding.editing.customer.dto';

@Injectable()
export class CustomerService extends TypeOrmCrudService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private readonly customer: Repository<Customer>,
  ) {
    super(customer);
  }

  add(data: AddingAndEditingCustomerDto): Promise<Customer | ApiResponse> {
    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString = passwordHash.digest('hex');

    const newCustomer: Customer = new Customer();
    newCustomer.forename = data.forename;
    newCustomer.surname = data.surname;
    newCustomer.phoneNumber = data.phone;
    newCustomer.address = data.address;
    newCustomer.city = data.city;
    newCustomer.postalAddress = data.postalAddress;
    newCustomer.email = data.email;
    newCustomer.passwordHash = passwordHashString;
    newCustomer.passwordResetLink = data.passwordResetLink;

    return new Promise((resolve) => {
      this.customer
        .save(newCustomer)
        .then((data) => resolve(data))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((error) => {
          const response: ApiResponse = new ApiResponse(
            'error',
            -300,
            'Ovaj korisnik već postoji!',
          );
          resolve(response);
        });
    });
  }

  async editById(
    id: number,
    data: AddingAndEditingCustomerDto,
  ): Promise<Customer | ApiResponse> {
    const currentCustomer: Customer = await this.customer.findOne(id);

    if (currentCustomer === undefined) {
      return new Promise((resolve) => {
        resolve(
          new ApiResponse(
            'error',
            -3001,
            'Korisnik sa traženim id-jem ne postoji!',
          ),
        );
      });
    }

    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString = passwordHash.digest('hex');

    currentCustomer.forename = data.forename;
    currentCustomer.surname = data.surname;
    currentCustomer.phoneNumber = data.phone;
    currentCustomer.address = data.address;
    currentCustomer.city = data.city;
    currentCustomer.postalAddress = data.postalAddress;
    currentCustomer.email = data.email;
    currentCustomer.passwordHash = passwordHashString;
    currentCustomer.passwordResetLink = data.passwordResetLink;

    return this.customer.save(currentCustomer);
  }
}
