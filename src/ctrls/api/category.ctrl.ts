import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Category } from 'entities/category.entity';
import { AddingAndEditingCategoryDto } from 'src/dtos/category/adding.editing.category.dto';
import { ApiResponse } from 'src/response/api.response';
import { CategoryService } from 'src/services/category/category.service';

@Controller('api/category')
@Crud({
  model: {
    type: Category,
  },
  params: {
    id: {
      field: 'categoryId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      parentCategory: {
        eager: true,
      },
      categories: {
        eager: true,
      },
    },
  },
})
export class CategoryController {
  constructor(public service: CategoryService) {}

  @Put()
  addCategory(
    @Body() data: AddingAndEditingCategoryDto,
  ): Promise<Category | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id')
  editCategory(
    @Param('id') categoryId: number,
    @Body() data: AddingAndEditingCategoryDto,
  ): Promise<Category | ApiResponse> {
    return this.service.editById(categoryId, data);
  }
}
