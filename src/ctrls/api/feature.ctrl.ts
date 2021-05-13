import { AddingAndEditingFeatureDto } from './../../dtos/feature/adding.editing.feature.dto';
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Feature } from 'entities/feature.entity';
import { FeatureService } from 'src/services/feature/feature.service';
import { ApiResponse } from 'src/response/api.response';

@Controller('api/feature')
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
})
export class FeatureController {
  constructor(public service: FeatureService) {}

  @Put()
  addCategory(@Body() data: AddingAndEditingFeatureDto): Promise<Feature> {
    return this.service.add(data);
  }

  @Post(':id')
  editCategory(
    @Param('id') featureId: number,
    @Body() data: AddingAndEditingFeatureDto,
  ): Promise<Feature | ApiResponse> {
    return this.service.editById(featureId, data);
  }
}
