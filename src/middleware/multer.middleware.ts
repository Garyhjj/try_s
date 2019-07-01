import { Middleware, NestMiddleware, Injectable } from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class MulterMiddleware implements NestMiddleware {
  resolve(): (req, res, next) => void {
    const upload = multer();
    return upload.any();
  }
}
