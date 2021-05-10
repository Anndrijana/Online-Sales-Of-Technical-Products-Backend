import { ApiResponse } from '../../response/api.response';
import { EditingAdministratorDto } from '../../dtos/administrator/editing.administrator.dto';
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';
import { AddingAdministratorDto } from 'src/dtos/administrator/adding.administrator.dto';
import { AdministratorService } from 'src/services/administrator/administrator.service';
import { Crud } from '@nestjsx/crud';

@Controller('api/administrator')
@Crud({
  model: {
    type: Administrator,
  },
  params: {
    id: {
      field: 'administratorId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {},
  },
})
export class AdministratorController {
  constructor(public service: AdministratorService) {}

  @Put()
  addAdmin(
    @Body() data: AddingAdministratorDto,
  ): Promise<Administrator | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id')
  editAdmin(
    @Param('id') administratorId: number,
    @Body() data: EditingAdministratorDto,
  ): Promise<Administrator | ApiResponse> {
    return this.service.editById(administratorId, data);
  }
}
