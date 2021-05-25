import { LoginInformationAdministratorDto } from './../../dtos/administrator/login.information.administrator.dto';
import { LoginAdministratorDto } from './../../dtos/administrator/login.administrator.dto';
import { AdministratorService } from './../../services/administrator/administrator.service';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
} from '@nestjs/common';
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
import { JwtDataRefreshCustomerDto } from 'src/dtos/customer/jwt.data.refresh.dto';
import { CustomerRefreshTokenDto } from 'src/dtos/customer/refresh.token.dto';

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
    jwtData.role = 'administrator';
    jwtData.id = administrator.administratorId;
    jwtData.identity = administrator.username;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 14);
    const ed = currentDate.getTime() / 1000;
    jwtData.exp = ed;
    jwtData.ip = req.ip.toString();
    jwtData.ua = req.headers['user-agent'];
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
    jwtData.role = 'customer';
    jwtData.id = customer.customerId;
    jwtData.identity = customer.email;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 14);
    const ed = currentDate.getTime() / 1000;
    jwtData.exp = ed;
    jwtData.ip = req.ip.toString();
    jwtData.ua = req.headers['user-agent'];
    console.log(jwtData);

    const token: string = jwt.sign(
      jwtData.toPlainObject(),
      jwtSecretInformation,
    );
    console.log(token);

    const jwtRefreshCustomerData = new JwtDataRefreshCustomerDto();
    jwtRefreshCustomerData.role = jwtData.role;
    jwtRefreshCustomerData.id = jwtData.id;
    jwtRefreshCustomerData.identity = jwtData.identity;
    jwtRefreshCustomerData.exp = this.getDatePlus(60 * 60 * 24 * 31);
    jwtRefreshCustomerData.ip = jwtData.ip;
    jwtRefreshCustomerData.ua = jwtData.ua;

    const refreshCustomerToken: string = jwt.sign(
      jwtRefreshCustomerData.toPlainObject(),
      jwtSecretInformation,
    );

    const responseObj = new LoginInformationCustomerDto(
      customer.customerId,
      customer.email,
      token,
      refreshCustomerToken,
      this.getIsoDate(jwtRefreshCustomerData.exp),
    );

    await this.customerService.addToken(
      customer.customerId,
      refreshCustomerToken,
      this.getDatabseDateFormat(this.getIsoDate(jwtRefreshCustomerData.exp)),
    );

    return new Promise((resolve) => resolve(responseObj));
  }

  @Post('customer/refresh')
  async customerRefreshToken(
    @Req() req: Request,
    @Body() data: CustomerRefreshTokenDto,
  ): Promise<LoginInformationCustomerDto | ApiResponse> {
    const customerToken = await this.customerService.getToken(data.token);

    if (!customerToken) {
      return new ApiResponse('error', -20001, 'No such refresh token!');
    }

    if (customerToken.isValid === 0) {
      return new ApiResponse('error', -20002, 'The token is no longer valid!');
    }

    const now = new Date();
    const exp = new Date(customerToken.exp);

    if (exp.getTime() < now.getTime()) {
      return new ApiResponse('error', -10004, 'The token has expired!');
    }

    let jwtRefreshCustomerData: JwtDataRefreshCustomerDto;

    try {
      jwtRefreshCustomerData = jwt.verify(
        data.token,
        jwtSecretInformation,
      ) as any;
    } catch (e) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }

    if (!jwtRefreshCustomerData) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }

    if (jwtRefreshCustomerData.ip !== req.ip.toString()) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }

    if (jwtRefreshCustomerData.ua !== req.headers['user-agent']) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }

    const jwtDataCustomer = new JwtDataCustomerDto();
    jwtDataCustomer.role = jwtRefreshCustomerData.role;
    jwtDataCustomer.id = jwtRefreshCustomerData.id;
    jwtDataCustomer.identity = jwtRefreshCustomerData.identity;
    jwtDataCustomer.exp = this.getDatePlus(60 * 5);
    jwtDataCustomer.ip = jwtRefreshCustomerData.ip;
    jwtDataCustomer.ua = jwtRefreshCustomerData.ua;

    const token: string = jwt.sign(
      jwtDataCustomer.toPlainObject(),
      jwtSecretInformation,
    );

    const responseObject = new LoginInformationCustomerDto(
      jwtDataCustomer.id,
      jwtDataCustomer.identity,
      token,
      data.token,
      this.getIsoDate(jwtRefreshCustomerData.exp),
    );

    return responseObject;
  }

  private getDatePlus(numberOfSeconds: number): number {
    return new Date().getTime() / 1000 + numberOfSeconds;
  }

  private getIsoDate(timestamp: number): string {
    const date = new Date();
    date.setTime(timestamp * 1000);
    return date.toISOString();
  }

  private getDatabseDateFormat(isoFormat: string): string {
    return isoFormat.substr(0, 19).replace('T', ' ');
  }
}
