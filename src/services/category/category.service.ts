import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Category } from 'entities/category.entity';
import { AddingAndEditingCategoryDto } from 'src/dtos/category/adding.editing.category.dto';
import { ApiResponse } from 'src/response/api.response';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
  ) {
    super(category);
  }

  add(data: AddingAndEditingCategoryDto): Promise<Category | ApiResponse> {
    const newCategory: Category = new Category();
    newCategory.categoryName = data.name;
    newCategory.imagePath = data.imagePath;
    newCategory.parentCategoryId = data.parentCategoryId;

    return new Promise((resolve) => {
      this.category
        .save(newCategory)
        .then((data) => resolve(data))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((error) => {
          const response: ApiResponse = new ApiResponse(
            'error',
            -300,
            'Ova kategorija već postoji!',
          );
          resolve(response);
        });
    });
  }

  async editById(
    id: number,
    data: AddingAndEditingCategoryDto,
  ): Promise<Category | ApiResponse> {
    const currentCategory: Category = await this.category.findOne(id);

    if (currentCategory === undefined) {
      return new Promise((resolve) => {
        resolve(
          new ApiResponse(
            'error',
            -3001,
            'Kategorija sa traženim id-jem ne postoji!',
          ),
        );
      });
    }

    currentCategory.categoryName = data.name;
    currentCategory.imagePath = data.imagePath;
    currentCategory.parentCategoryId = data.parentCategoryId;

    return this.category.save(currentCategory);
  }
}
