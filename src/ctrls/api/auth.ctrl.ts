import { LoginInformationAdministratorDto } from './../../dtos/administrator/login.information.administrator.dto';
import { LoginAdministratorDto } from './../../dtos/administrator/login.administrator.dto';
import { AdministratorService } from './../../services/administrator/administrator.service';
import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { ApiResponse } from 'src/other/api.response';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { jwtSecretInformation } from 'config/jwt.secret.information';
import * as crypto from 'crypto';
import { JwtDataAdministratorDto } from 'src/dtos/administrator/jwt.data.administrator.dto';
import { CustomerService } from 'src/services/customer/customer.service';
import { LoginInformationCustomerDto } from 'src/dtos/customer/login.information.customer.dto';
import { JwtDataCustomerDto } from 'src/dtos/customer/jwt.data.customer.dto';
import { LoginCustomerDto } from 'src/dtos/customer/login.customer.dto';
import { CustomerRegistrationDto } from 'src/dtos/customer/customer.registration.dto';

@Controller('auth')
export class AuthController {
  constructor(
    public administratorService: AdministratorService,
    public customerService: CustomerService,
  ) {}

  @Post('admin/login')
  async loginAdmin(
    @Body() data: LoginAdministratorDto,
    @Req() req: Request,
  ): Promise<LoginInformationAdministratorDto | ApiResponse> {
    const administrator = await this.administratorService.getByUsername(
      data.username,
    );

    if (!administrator) {
      return new Promise((resolve) =>
        resolve(new ApiResponse('error', -3003, 'Unet je pogrešan username!')),
      );
    }

    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString = passwordHash.digest('hex');

    if (administrator.passwordHash !== passwordHashString) {
      return new Promise((resolve) =>
        resolve(new ApiResponse('error', -3004, 'Unet je pogrešan password!')),
      );
    }

    const jwtData = new JwtDataAdministratorDto();
    jwtData.administratorId = administrator.administratorId;
    jwtData.username = administrator.username;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 14);
    const ed = currentDate.getTime() / 1000;
    jwtData.expiryDate = ed;
    jwtData.ipAddress = req.ip.toString();
    jwtData.userAgent = req.headers['user-agent'];
    console.log(jwtData);

    const token: string = jwt.sign(
      jwtData.toPlainObject(),
      jwtSecretInformation,
    );
    console.log(token);

    const responseObj = new LoginInformationAdministratorDto(
      administrator.administratorId,
      administrator.username,
      token,
    );

    return new Promise((resolve) => resolve(responseObj));
  }

  @Put('customer/register')
  async customerRegister(@Body() data: CustomerRegistrationDto) {
    return await this.customerService.registerCustomer(data);
  }

  @Post('customer/login')
  async loginCustomer(
    @Body() data: LoginCustomerDto,
    @Req() req: Request,
  ): Promise<LoginInformationCustomerDto | ApiResponse> {
    const customer = await this.customerService.getByEmail(data.email);

    if (!customer) {
      return new Promise((resolve) =>
        resolve(new ApiResponse('error', -3003, 'Unet je pogrešan email!')),
      );
    }

    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString = passwordHash.digest('hex');

    if (customer.passwordHash !== passwordHashString) {
      return new Promise((resolve) =>
        resolve(new ApiResponse('error', -3004, 'Unet je pogrešan password!')),
      );
    }

    const jwtData = new JwtDataCustomerDto();
    jwtData.customerId = customer.customerId;
    jwtData.email = customer.email;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 14);
    const ed = currentDate.getTime() / 1000;
    jwtData.expiryDate = ed;
    jwtData.ipAddress = req.ip.toString();
    jwtData.userAgent = req.headers['user-agent'];
    console.log(jwtData);

    const token: string = jwt.sign(
      jwtData.toPlainObject(),
      jwtSecretInformation,
    );
    console.log(token);

    const responseObj = new LoginInformationCustomerDto(
      customer.customerId,
      customer.email,
      token,
    );

    return new Promise((resolve) => resolve(responseObj));
  }
}
