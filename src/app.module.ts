import { FeatureController } from './ctrls/api/feature.ctrl';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './ctrls/api/category.ctrl';
import { ProductShoppingCart } from './../entities/product-shoppingCart.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './ctrls/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from './../config/database.configuration';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { Category } from 'entities/category.entity';
import { Customer } from 'entities/customer.entity';
import { Feature } from 'entities/feature.entity';
import { Image } from 'entities/image.entity';
import { Order } from 'entities/order.entity';
import { Price } from 'entities/price.entity';
import { ProductFeature } from 'entities/product-feature.entity';
import { Product } from 'entities/product.entity';
import { ShoppingCart } from 'entities/shoppingCart.entity';
import { AdministratorController } from './ctrls/api/administrator.ctrl';
import { ProductService } from './services/product/product.service';
import { ProductController } from './ctrls/api/product.ctrl';
import { AuthController } from './ctrls/api/auth.ctrl';
import { CustomerController } from './ctrls/api/customer.ctrl';
import { CustomerService } from './services/customer/customer.service';
import { FeatureService } from './services/feature/feature.service';
import { PriceController } from './ctrls/api/price.ctrl';
import { PriceService } from './services/price/price.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Administrator,
        Category,
        Customer,
        Feature,
        Image,
        Order,
        Price,
        ProductFeature,
        ProductShoppingCart,
        Product,
        ShoppingCart,
      ],
    }),
    TypeOrmModule.forFeature([
      Administrator,
      Category,
      Product,
      Price,
      ProductFeature,
      Customer,
      Feature,
      Image,
    ]),
  ],
  controllers: [
    AppController,
    AdministratorController,
    CategoryController,
    ProductController,
    AuthController,
    CustomerController,
    FeatureController,
    PriceController,
  ],
  providers: [
    AdministratorService,
    CategoryService,
    ProductService,
    CustomerService,
    FeatureService,
    PriceService,
  ],
  exports: [AdministratorService],
})
export class AppModule {}
/*implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*');
  }*/
