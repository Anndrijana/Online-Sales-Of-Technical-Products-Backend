import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Category } from 'entities/category.entity';
import { CategoryVisitorsService } from 'src/services/categoryVisitors/categoryVisitors.service';

@Controller('visitor/category')
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
    only: ['getManyBase', 'getOneBase'],
  },
})
export class CategoryVisitorsController {
  constructor(public service: CategoryVisitorsService) {}
}
