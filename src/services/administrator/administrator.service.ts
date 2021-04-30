import { EditingAdministratorDto } from './../../dtos/administrator/editing.administrator.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'entities/administrator.entity';
import { AddingAdministratorDto } from 'src/dtos/administrator/adding.administrator.dto';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

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

  add(data: AddingAdministratorDto) {
    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString = passwordHash.digest('hex');

    const newAdministrator: Administrator = new Administrator();
    newAdministrator.username = data.username;
    newAdministrator.passwordHash = passwordHashString;

    return this.administrator.save(newAdministrator);
  }

  async editById(id: number, data: EditingAdministratorDto) {
    const currentAdmin: Administrator = await this.administrator.findOne(id);

    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString = passwordHash.digest('hex');

    currentAdmin.passwordHash = passwordHashString;

    return this.administrator.save(currentAdmin);
  }
}
