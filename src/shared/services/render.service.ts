import { Injectable } from '@nestjs/common';
import * as consolidate from 'consolidate';

@Injectable()
export class RenderService {
  async render(path: string, data: any) {
    return consolidate.ejs(path, data);
  }
}
