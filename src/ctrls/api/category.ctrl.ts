import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Category } from 'entities/category.entity';
import { AddingAndEditingCategoryDto } from 'src/dtos/category/adding.editing.category.dto';
import { AllowToRoles } from 'src/other/allow.to.role.descriptor';
import { ApiResponse } from 'src/other/api.response';
import { RolesGuard } from 'src/other/role.checker.guard';
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
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'deleteOneBase',
      'updateOneBase',
      'createOneBase',
    ],
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
    updateOneBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
    createManyBase: {
      decorators: [UseGuards(RolesGuard), AllowToRoles('administrator')],
    },
  },
})
export class CategoryController {
  constructor(public service: CategoryService) {}

  @Put()
  @UseGuards(RolesGuard)
  @AllowToRoles('administrator')
  addCategory(
    @Body() data: AddingAndEditingCategoryDto,
  ): Promise<Category | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id')
  @UseGuards(RolesGuard)
  @AllowToRoles('administrator')
  editCategory(
    @Param('id') categoryId: number,
    @Body() data: AddingAndEditingCategoryDto,
  ): Promise<Category | ApiResponse> {
    return this.service.editById(categoryId, data);
  }
}
