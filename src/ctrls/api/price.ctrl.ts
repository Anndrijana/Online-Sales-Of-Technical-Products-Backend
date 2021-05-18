import { Controller, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Price } from 'entities/price.entity';
import { AllowToRoles } from 'src/other/allow.to.role.descriptor';
import { RolesGuard } from 'src/other/role.checker.guard';
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
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'createOneBase',
      'createManyBase',
      'updateOneBase',
      'deleteOneBase',
    ],
    getManyBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
    getOneBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
    createOneBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
    createManyBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
    updateOneBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
    deleteOneBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
  },
})
export class PriceController {
  constructor(public service: PriceService) {}
}
