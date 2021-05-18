import { ApiResponse } from 'src/other/api.response';
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Customer } from 'entities/customer.entity';
import { AddingAndEditingCustomerDto } from 'src/dtos/customer/adding.editing.customer.dto';
import { CustomerService } from 'src/services/customer/customer.service';
import { AllowToRoles } from 'src/other/allow.to.role.descriptor';
import { RolesGuard } from 'src/other/role.checker.guard';

@Controller('api/customer')
@Crud({
  model: {
    type: Customer,
  },
  params: {
    id: {
      field: 'customerId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {},
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
    getOneBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
    deleteOneBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('customer')],
    },
  },
})
export class CustomerController {
  constructor(public service: CustomerService) {}

  @Put()
  @UseGuards(RolesGuard)
  @AllowToRoles('customer')
  addCustomer(
    @Body() data: AddingAndEditingCustomerDto,
  ): Promise<Customer | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id')
  @UseGuards(RolesGuard)
  @AllowToRoles('customer')
  editCustomer(
    @Param('id') customerId: number,
    @Body() data: AddingAndEditingCustomerDto,
  ): Promise<Customer | ApiResponse> {
    return this.service.editById(customerId, data);
  }
}
