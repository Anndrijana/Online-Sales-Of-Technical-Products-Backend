import { AddingAndEditingFeatureDto } from './../../dtos/feature/adding.editing.feature.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Feature } from 'entities/feature.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/other/api.response';

@Injectable()
export class FeatureService extends TypeOrmCrudService<Feature> {
  constructor(
    @InjectRepository(Feature)
    private readonly feature: Repository<Feature>,
  ) {
    super(feature);
  }

  add(data: AddingAndEditingFeatureDto): Promise<Feature> {
    const newFeature: Feature = new Feature();
    newFeature.featureName = data.name;
    newFeature.categoryId = data.categoryId;

    return new Promise((resolve) => {
      this.feature.save(newFeature).then((data) => resolve(data));
    });
  }

  async editById(
    id: number,
    data: AddingAndEditingFeatureDto,
  ): Promise<Feature | ApiResponse> {
    const currentFeature: Feature = await this.feature.findOne(id);

    if (currentFeature === undefined) {
      return new Promise((resolve) => {
        resolve(
          new ApiResponse(
            'error',
            -3001,
            'Osobina sa traženim id-jem ne postoji!',
          ),
        );
      });
    }

    currentFeature.featureName = data.name;
    currentFeature.categoryId = data.categoryId;

    return this.feature.save(currentFeature);
  }
}
