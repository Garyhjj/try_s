import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './config/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Ihub API Document')
    // .setDescription('The cats API description')
    .setVersion('1.0')
    // .addTag('exam')
    .addBearerAuth('access_token', 'header', 'access_token')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('document', app, document);

  app.use(express.static(path.join(__dirname, 'upload')));
  await app.listen(serverConfig.port);
  // tslint:disable-next-line:no-console
  console.log('http://localhost:' + serverConfig.port);
}
bootstrap();
