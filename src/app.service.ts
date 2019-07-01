import { UtilService } from './core/util.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private utilService: UtilService) {}
  root(): string {
    return 'Hello World!';
  }

  async getTableJsonObject(tableName: string) {
    const result = await this.utilService.getTableJsonObject(tableName);
    // return this.appService.root();
    return result;
  }

  async getTableInterfaceString(tableName: string) {
    const result = await this.utilService.getTableInterfaceString(tableName);
    return result;
  }
}
