/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Product } from 'entities/product.entity';
import { ApiResponse } from 'src/response/api.response';
import { AddingProductDto } from 'src/dtos/product/adding.product.dto';
import { ProductService } from 'src/services/product/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DataStorageConfiguration } from 'config/data.storage.configuration';
import { ImageService } from 'src/services/image/image.service';
import { Image } from 'entities/image.entity';

@Controller('api/product')
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
})
export class ProductController {
  constructor(
    public service: ProductService,
    public imageService: ImageService,
  ) {}

  @Put()
  addProduct(@Body() data: AddingProductDto): Promise<Product | ApiResponse> {
    return this.service.add(data);
  }

  @Post(':id/uploadImage/')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destinaton: DataStorageConfiguration.imageDest,
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
        fileSize: DataStorageConfiguration.imageMaxSize,
      },
    }),
  )
  async uploadImage(@Param('id') productId: number, @UploadedFile() image) {
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
}
