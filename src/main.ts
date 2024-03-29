import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DataStorageConfiguration } from 'config/data.storage.configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(DataStorageConfiguration.destination, {
    prefix: DataStorageConfiguration.urlPrefix,
    maxAge: DataStorageConfiguration.maxAge,
    index: false,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
