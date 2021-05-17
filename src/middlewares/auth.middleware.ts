import { JwtDataCustomerDto } from 'src/dtos/customer/jwt.data.customer.dto';
import {
  NestMiddleware,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtDataAdministratorDto } from 'src/dtos/administrator/jwt.data.administrator.dto';

import { AdministratorService } from 'src/services/administrator/administrator.service';
import { CustomerService } from 'src/services/customer/customer.service';
import { jwtSecretInformation } from 'config/jwt.secret.information';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    public administratorService: AdministratorService,
    public customerService: CustomerService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    const token = req.headers.authorization;

    let jwtData: JwtDataAdministratorDto | JwtDataCustomerDto;

    try {
      jwtData = jwt.verify(token, jwtSecretInformation) as any;
    } catch (e) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }

    if (!jwtData) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }

    if (jwtData.ip !== req.ip.toString()) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }

    if (jwtData.ua !== req.headers['user-agent']) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }

    if (jwtData.role === 'administrator') {
      const administrator = await this.administratorService.getById(jwtData.id);
      if (!administrator) {
        throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
      }
    } else if (jwtData.role === 'customer') {
      const user = await this.customerService.getById(jwtData.id);
      if (!user) {
        throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
      }
    }

    const trenutniTimestamp = new Date().getTime() / 1000;
    if (trenutniTimestamp >= jwtData.exp) {
      throw new HttpException('The token has expired', HttpStatus.UNAUTHORIZED);
    }

    req.token = jwtData;

    next();
  }
}
