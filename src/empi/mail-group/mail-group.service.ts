import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { Injectable } from '@nestjs/common';
import { toStoreString } from '../../shared/tables';
import { CacheResult } from '../../shared/decorators';
import { EmpiMailgroupObject, EmpiMailgroupEntity } from './empi-mailgroup.dto';

@Injectable()
export class MailGroupService {
    db: DatabaseTable;
  constructor(
    private databaseService: DatabaseService,
  ) {
      this.db = this.databaseService.getTableInstance(EmpiMailgroupObject, EmpiMailgroupEntity);
  }

  getGroups(query) {
      return this.db.search(`select * from ${EmpiMailgroupObject.tableName}`);
  }
}
