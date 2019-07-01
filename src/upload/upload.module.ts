import { MulterMiddleware } from './../middleware/multer.middleware';
import { UploadController } from './upload.controller';
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(MulterMiddleware).forRoutes(UploadController);
  }
}
