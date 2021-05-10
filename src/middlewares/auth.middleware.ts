import { JwtDataAdministratorDto } from 'src/dtos/administrator/jwt.data.administrator.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AdministratorService } from 'src/services/administrator/administrator.service';
import * as jwt from 'jsonwebtoken';
import { jwtSecretInformation } from 'config/jwt.secret.information';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly administratorService: AdministratorService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new HttpException(
        'Nije pronađen odgovarajući token!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = req.headers.authorization;
    console.log(token);
    console.log(typeof token);

    const jwtData: JwtDataAdministratorDto = jwt.verify(
      token,
      jwtSecretInformation,
    ) as any;
    console.log(jwtData);

    if (!jwtData) {
      throw new HttpException(
        'Nije pronađen odgovarajući token!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (jwtData.ip !== req.ip.toString()) {
      throw new HttpException(
        'Nije pronađen odgovarajući token!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (jwtData.ua !== req.headers['user-agent']) {
      throw new HttpException(
        'Nije pronađen odgovarajući token!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const administrator = await this.administratorService.getById(jwtData.id);
    if (!administrator) {
      throw new HttpException(
        'Nalog administratora nije pronađen!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const currentTimestamp = new Date().getTime() / 1000;

    if (currentTimestamp >= jwtData.exp) {
      throw new HttpException('Token je istekao!', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
