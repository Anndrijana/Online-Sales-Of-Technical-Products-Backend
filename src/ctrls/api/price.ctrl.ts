import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Price } from 'entities/price.entity';
import { PriceService } from 'src/services/price/price.service';

@Controller('api/price')
@Crud({
  model: {
    type: Price,
  },
  params: {
    id: {
      field: 'priceId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      product: {
        eager: true,
      },
    },
  },
})
export class PriceController {
  constructor(public service: PriceService) {}
}
