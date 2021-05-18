import { ApiResponse } from 'src/other/api.response';
import { EditingAdministratorDto } from '../../dtos/administrator/editing.administrator.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';
import { AddingAdministratorDto } from 'src/dtos/administrator/adding.administrator.dto';
import { AdministratorService } from 'src/services/administrator/administrator.service';
import { Crud } from '@nestjsx/crud';
import { AllowToRoles } from 'src/other/allow.to.role.descriptor';
import { RolesGuard } from 'src/other/role.checker.guard';

@Controller('api/administrator')
@UseGuards(RolesGuard)
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
  routes: {
    only: ['getOneBase', 'deleteOneBase'],
    getOneBase: {
      decorators: [
        UseGuards(RolesGuard),
        AllowToRoles('administrator', 'customer'),
      ],
    },
    deleteOneBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
  },
})
export class AdministratorController {
  constructor(public service: AdministratorService) {}

  @Get()
  @AllowToRoles('administrator')
  getAll(): Promise<Administrator[]> {
    return this.service.getAll();
  }

  @Put()
  @AllowToRoles('administrator')
  addAdmin(
    @Body() data: AddingAdministratorDto,
  ): Promise<Administrator | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id')
  @AllowToRoles('administrator')
  editAdmin(
    @Param('id') administratorId: number,
    @Body() data: EditingAdministratorDto,
  ): Promise<Administrator | ApiResponse> {
    return this.service.editById(administratorId, data);
  }
}
