import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Order } from 'entities/order.entity';
import { AddingAndEditingOrderDto } from 'src/dtos/order/adding.editing.order';
import { ApiResponse } from 'src/other/api.response';
import { OrderService } from 'src/services/order/order.service';
import { DeleteResult } from 'typeorm';

@Controller('api/order')
@Crud({
  model: {
    type: Order,
  },
  params: {
    id: {
      field: 'orderId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {},
  },
})
export class OrderController {
  constructor(public service: OrderService) {}

  @Put()
  addOrder(
    @Body() data: AddingAndEditingOrderDto,
  ): Promise<Order | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id')
  editOrder(
    @Param('id') orderId: number,
    @Body() data: AddingAndEditingOrderDto,
  ): Promise<Order | ApiResponse> {
    return this.service.editById(orderId, data);
  }

  @Delete(':id')
  async delete(@Param('id') id): Promise<DeleteResult | ApiResponse> {
    return this.service.delete(id);
  }
}
