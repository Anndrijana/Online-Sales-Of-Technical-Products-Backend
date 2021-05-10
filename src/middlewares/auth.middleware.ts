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
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly administratorService: AdministratorService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
    }

    const token = req.headers.authorization;

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2) {
      throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
    }
    const tokenString = tokenParts[1];

    let jwtData: JwtDataAdministratorDto;

    jwt.verify(tokenString, jwtSecretInformation);

    if (!jwtData) {
      throw new HttpException(
        'Nije pronađen odgovarajući token!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (jwtData.ipAddress !== req.ip.toString()) {
      throw new HttpException(
        'Nije pronađen odgovarajući token!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (jwtData.userAgent !== req.headers['user-agent']) {
      throw new HttpException(
        'Nije pronađen odgovarajući token!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const administrator = await this.administratorService.getById(
      jwtData.administratorId,
    );
    if (!administrator) {
      throw new HttpException(
        'Nalog administratora nije pronađen!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const currentTimestamp = new Date().getTime() / 1000;

    if (currentTimestamp >= jwtData.expiryDate) {
      throw new HttpException('Token je istekao!', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
