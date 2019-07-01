import { EmpiFilesObject } from './../files/empi-files.dto';
import {
  EmpiFileRelationObject,
  EmpiFileRelationEntity,
} from './empi-file-relation.dto';
import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { Injectable } from '@nestjs/common';
import { toStoreString } from '../../shared/tables';
import { CacheResult } from '../../shared/decorators';
import { sortUtils } from '../../shared/utils';

@Injectable()
export class FileRelationService {
  db: DatabaseTable;
  constructor(private databaseService: DatabaseService) {
    this.db = this.databaseService.getTableInstance(
      EmpiFileRelationObject,
      EmpiFileRelationEntity,
    );
  }

  async getRelation({ file_id }) {
    const idS: string = file_id || '';
    const ids = idS.split(',').map(_ => +_);
    const res = await this.db.search(`select a.*, (select file_name from ${
      EmpiFilesObject.tableName
    } where id = a.file_id
      and rownum = 1) file_name
    from ${
      EmpiFileRelationObject.tableName
    } a where ('${ids}' is null or file_id in (${ids.join(',')}))`);
    return res.sort((a, b) => sortUtils.byNumber(a.FILE_ID, b.FILE_ID));
  }

  async updateRelation(body, userID) {
    const { ID } = body;
    if (ID > 0) {
      await this.db.update(
        {
          columns: body,
          where: {
            ID,
          },
        },
        userID,
      );
      return ID;
    } else {
      return this.db.insert(body, userID);
    }
  }

  async deleteRelation(id) {
    return this.db.delete({ where: { ID: id } });
  }
}
