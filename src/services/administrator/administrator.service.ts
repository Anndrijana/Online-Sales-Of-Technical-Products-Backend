import { EditingAdministratorDto } from './../../dtos/administrator/editing.administrator.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { AddingAdministratorDto } from 'src/dtos/administrator/adding.administrator.dto';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { resolve } from 'node:path';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ApiResponse } from 'src/other/api.response';
import { AdministratorToken } from 'entities/administrator-token.entity';

@Injectable()
export class AdministratorService extends TypeOrmCrudService<Administrator> {
  constructor(
    @InjectRepository(Administrator)
    private readonly administrator: Repository<Administrator>,

    @InjectRepository(AdministratorToken)
    private readonly administratorToken: Repository<AdministratorToken>,
  ) {
    super(administrator);
  }

  getAll(): Promise<Administrator[]> {
    return this.administrator.find();
  }

  getById(id: number): Promise<Administrator> {
    return this.administrator.findOne(id);
  }

  async getByUsername(findUsername: string): Promise<Administrator | null> {
    const administrator = await this.administrator.findOne({
      username: findUsername,
    });

    if (administrator) {
      return administrator;
    }

    return null;
  }

  add(data: AddingAdministratorDto): Promise<Administrator | ApiResponse> {
    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString = passwordHash.digest('hex');

    const newAdministrator: Administrator = new Administrator();
    newAdministrator.username = data.username;
    newAdministrator.passwordHash = passwordHashString;

    return new Promise((resolve) => {
      this.administrator
        .save(newAdministrator)
        .then((data) => resolve(data))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((error) => {
          const response: ApiResponse = new ApiResponse(
            'error',
            -300,
            'Ovaj administrator već postoji!',
          );
          resolve(response);
        });
    });
  }

  async editById(
    id: number,
    data: EditingAdministratorDto,
  ): Promise<Administrator | ApiResponse> {
    const currentAdministrator: Administrator = await this.administrator.findOne(
      id,
    );

    if (currentAdministrator === undefined) {
      return new Promise((resolve) => {
        resolve(
          new ApiResponse(
            'error',
            -3001,
            'Administrator sa traženim id-jem ne postoji!',
          ),
        );
      });
    }

    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString = passwordHash.digest('hex');

    currentAdministrator.passwordHash = passwordHashString;

    return this.administrator.save(currentAdministrator);
  }

  async addToken(id: number, token: string, expiresAt: string) {
    const administratorToken = new AdministratorToken();
    administratorToken.administratorId = id;
    administratorToken.token = token;
    administratorToken.exp = expiresAt;

    return await this.administratorToken.save(administratorToken);
  }

  async getToken(token: string): Promise<AdministratorToken> {
    return await this.administratorToken.findOne({
      token: token,
    });
  }

  async invalidateToken(
    token: string,
  ): Promise<AdministratorToken | ApiResponse> {
    const administratorToken = await this.administratorToken.findOne({
      token: token,
    });

    if (!administratorToken) {
      return new ApiResponse('error', -10001, 'No such refresh token!');
    }

    administratorToken.isValid = 0;

    await this.administratorToken.save(administratorToken);

    return await this.getToken(token);
  }

  async invalidateAdministratorTokens(
    id: number,
  ): Promise<(AdministratorToken | ApiResponse)[]> {
    const administratorTokens = await this.administratorToken.find({
      administratorId: id,
    });

    const results = [];

    for (const administratorToken of administratorTokens) {
      results.push(this.invalidateToken(administratorToken.token));
    }

    return results;
  }
}
