import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Order } from 'entities/order.entity';
import { AddingAndEditingOrderDto } from 'src/dtos/order/adding.editing.order';
import { ChangeOrderStatusDto } from 'src/dtos/order/change.order.status.dto';
import { AllowToRoles } from 'src/other/allow.to.role.descriptor';
import { ApiResponse } from 'src/other/api.response';
import { RolesGuard } from 'src/other/role.checker.guard';
import { OrderService } from 'src/services/order/order.service';
import { DeleteResult } from 'typeorm';

@Controller('api/order')
@UseGuards(RolesGuard)
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
  @AllowToRoles('customer')
  addOrder(
    @Body() data: AddingAndEditingOrderDto,
  ): Promise<Order | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id')
  @AllowToRoles('customer')
  editOrder(
    @Param('id') orderId: number,
    @Body() data: AddingAndEditingOrderDto,
  ): Promise<Order | ApiResponse> {
    return this.service.editById(orderId, data);
  }

  @Delete(':id')
  @AllowToRoles('customer')
  async delete(@Param('id') id): Promise<DeleteResult | ApiResponse> {
    return this.service.delete(id);
  }

  @Get()
  @AllowToRoles('administrator')
  async getAll(): Promise<Order[]> {
    return await this.service.getAll();
  }

  // GET http://localhost:3000/api/order/:id/
  @Get(':id')
  @AllowToRoles('administrator')
  async get(@Param('id') id: number): Promise<Order | ApiResponse> {
    const order = await this.service.getById(id);

    if (!order) {
      return new ApiResponse('error', -9001, 'No such order found!');
    }

    return order;
  }

  @Patch(':id')
  @AllowToRoles('administrator')
  async changeStatus(
    @Param('id') id: number,
    @Body() data: ChangeOrderStatusDto,
  ): Promise<Order | ApiResponse> {
    return await this.service.changeStatus(id, data.newStatus);
  }
}
