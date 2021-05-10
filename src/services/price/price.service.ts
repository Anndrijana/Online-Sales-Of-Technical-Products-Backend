import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Price } from 'entities/price.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PriceService extends TypeOrmCrudService<Price> {
  constructor(
    @InjectRepository(Price)
    private readonly price: Repository<Price>,
  ) {
    super(price);
  }
}
