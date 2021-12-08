/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Product } from 'entities/product.entity';
import { ApiResponse } from 'src/other/api.response';
import { AddingProductDto } from 'src/dtos/product/adding.product.dto';
import { ProductService } from 'src/services/product/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DataStorageConfiguration } from 'config/data.storage.configuration';
import { ImageService } from 'src/services/image/image.service';
import { Image } from 'entities/image.entity';
import { DeleteResult } from 'typeorm';
import { AllowToRoles } from 'src/other/allow.to.role.descriptor';
import * as fs from 'fs';
import { RolesGuard } from 'src/other/role.checker.guard';
import { EditingProductDto } from 'src/dtos/product/editing.product.dto';
import { ProductSearchDto } from 'src/dtos/product/search.dto';

@Controller('api/product')
@UseGuards(RolesGuard)
@Crud({
  model: {
    type: Product,
  },
  params: {
    id: {
      field: 'productId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      category: {
        eager: true,
      },
      images: {
        eager: true,
      },
      prices: {
        eager: true,
      },
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
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
  },
})
export class ProductController {
  constructor(
    public service: ProductService,
    public imageService: ImageService,
  ) {}

  @Post()
  @AllowToRoles('administrator')
  addProduct(@Body() data: AddingProductDto): Promise<Product | ApiResponse> {
    return this.service.add(data);
  }

  @Patch(':id')
  @AllowToRoles('administrator')
  editProduct(@Param('id') id: number, @Body() data: EditingProductDto) {
    return this.service.editProduct(id, data);
  }

  @Post(':id/uploadImage/')
  @AllowToRoles('administrator')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: DataStorageConfiguration.destination,
        filename: (req, file, callback) => {
          const originalFileName: string = file.originalname;

          const transformFileName = originalFileName.replace(/\s+/g, '-');

          const randomNumber: string = new Array(10)
            .fill(0)
            .map((e) => (Math.random() * 9).toFixed(0).toString())
            .join('');

          const newFileName = randomNumber + '-' + transformFileName;

          callback(null, newFileName);
        },
      }),
      limits: {
        files: 1,
        fileSize: DataStorageConfiguration.maxSize,
      },
    }),
  )
  async uploadImage(
    @Param('id') productId: number,
    @UploadedFile() image,
  ): Promise<Image | ApiResponse> {
    const imagePath = image.filename;

    const newImage: Image = new Image();
    newImage.productId = productId;
    newImage.imagePath = imagePath;

    const savedImage = await this.imageService.add(newImage);
    if (!savedImage) {
      return new ApiResponse('error', -3003, 'Fotografija nije otpremljena!');
    }

    return savedImage;
  }

  @Delete(':productId/deleteImage/:imageId')
  @AllowToRoles('administrator')
  public async deleteImage(
    @Param('productId') productId: number,
    @Param('imageId') imageId: number,
  ) {
    const image = await this.imageService.findOne({
      productId: productId,
      imageId: imageId,
    });

    if (!image) {
      return new ApiResponse('error', -4004, 'Photo not found!');
    }

    try {
      fs.unlinkSync(DataStorageConfiguration.destination + image.imagePath);
    } catch (e) {}

    const deleteResult = await this.imageService.deleteById(imageId);
    if (deleteResult.affected === 0) {
      return new ApiResponse('error', -4004, 'Photo not found!');
    }

    return new ApiResponse('ok', 0, 'One photo deleted!');
  }

  @Delete(':id')
  @AllowToRoles('administrator')
  async delete(@Param('id') id): Promise<DeleteResult | ApiResponse> {
    return this.service.delete(id);
  }

  @Post('search')
  @AllowToRoles('administrator', 'customer')
  async search(
    @Body() data: ProductSearchDto,
  ): Promise<Product[] | ApiResponse> {
    return await this.service.search(data);
  }
}
