import { ProductShoppingCart } from './../entities/product-shoppingCart.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
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
    TypeOrmModule.forFeature([Administrator]),
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
