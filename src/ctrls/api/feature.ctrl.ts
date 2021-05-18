import { RolesGuard } from './../../other/role.checker.guard';
import { AddingAndEditingFeatureDto } from './../../dtos/feature/adding.editing.feature.dto';
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Feature } from 'entities/feature.entity';
import { FeatureService } from 'src/services/feature/feature.service';
import { ApiResponse } from 'src/other/api.response';
import { AllowToRoles } from 'src/other/allow.to.role.descriptor';

@Controller('api/feature')
@UseGuards(RolesGuard)
@Crud({
  model: {
    type: Feature,
  },
  params: {
    id: {
      field: 'featureId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      category: {
        eager: true,
      },
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [
        UseGuards(RolesGuard),
        AllowToRoles('administrator', 'customer'),
      ],
    },
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
export class FeatureController {
  constructor(public service: FeatureService) {}

  @Put()
  @AllowToRoles('administrator')
  addCategory(@Body() data: AddingAndEditingFeatureDto): Promise<Feature> {
    return this.service.add(data);
  }

  @Post(':id')
  @AllowToRoles('administrator')
  editCategory(
    @Param('id') featureId: number,
    @Body() data: AddingAndEditingFeatureDto,
  ): Promise<Feature | ApiResponse> {
    return this.service.editById(featureId, data);
  }
}
