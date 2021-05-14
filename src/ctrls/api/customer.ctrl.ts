import { ApiResponse } from 'src/other/api.response';
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Customer } from 'entities/customer.entity';
import { AddingAndEditingCustomerDto } from 'src/dtos/customer/adding.editing.customer.dto';
import { CustomerService } from 'src/services/customer/customer.service';

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
})
export class CustomerController {
  constructor(public service: CustomerService) {}

  @Put()
  addAdmin(
    @Body() data: AddingAndEditingCustomerDto,
  ): Promise<Customer | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id')
  editAdmin(
    @Param('id') customerId: number,
    @Body() data: AddingAndEditingCustomerDto,
  ): Promise<Customer | ApiResponse> {
    return this.service.editById(customerId, data);
  }
}
