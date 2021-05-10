import { LoginInformationAdministratorDto } from './../../dtos/administrator/login.information.administrator.dto';
import { LoginAdministratorDto } from './../../dtos/administrator/login.administrator.dto';
import { AdministratorService } from './../../services/administrator/administrator.service';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiResponse } from 'src/response/api.response';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { jwtSecretInformation } from 'config/jwt.secret.information';
import * as crypto from 'crypto';
import { JwtDataAdministratorDto } from 'src/dtos/administrator/jwt.data.administrator.dto';

@Controller('auth')
export class AuthController {
  constructor(public administratorService: AdministratorService) {}

  @Post('login')
  async login(
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
    currentDate.setDate(currentDate.getDate() + 7);
    const ed = currentDate.getTime() / 1000;
    jwtData.expiryDate = ed;
    jwtData.ipAddress = req.ip.toString();
    jwtData.userAgent = req.headers['user-agent'];

    const token: string = jwt.sign(
      jwtData.toPlainObject(),
      jwtSecretInformation,
    );

    const responseObj = new LoginInformationAdministratorDto(
      administrator.administratorId,
      administrator.username,
      token,
    );

    return new Promise((resolve) => resolve(responseObj));
  }
}
