import { EditingAdministratorDto } from './../../dtos/administrator/editing.administrator.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { AddingAdministratorDto } from 'src/dtos/administrator/adding.administrator.dto';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { resolve } from 'node:path';
import { ApiResponse } from 'src/apiResponse/api.response';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administrator: Repository<Administrator>,
  ) {}

  getAll(): Promise<Administrator[]> {
    return this.administrator.find();
  }

  getById(id: number): Promise<Administrator> {
    return this.administrator.findOne(id);
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
          const response: ApiResponse = new ApiResponse('error', -300);
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
        resolve(new ApiResponse('error', -3001));
      });
    }

    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString = passwordHash.digest('hex');

    currentAdministrator.passwordHash = passwordHashString;

    return this.administrator.save(currentAdministrator);
  }
}
