import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { Injectable } from '@nestjs/common';
import { toStoreString } from '../../shared/tables';
import { CacheResult } from '../../shared/decorators';
import { EmpiLookupObject, EmpiLookupEntity } from './empi-lookup.dto';

@Injectable()
export class LookupService {
  db: DatabaseTable;

  bossType = 'BOSS';
  constructor(private databaseService: DatabaseService) {
    this.db = this.databaseService.getTableInstance(
      EmpiLookupObject,
      EmpiLookupEntity,
    );
  }

  getLookup({ type }) {
    type = toStoreString(type);
    return this.db.search(`select * from ${EmpiLookupObject.tableName}
      where type = ${type}`);
  }

  deleteLookup(id) {
    return this.db.delete({where: { ID: id}});
  }

  async updateBoss(body, userID) {
    if (!body) {
      return;
    }
    body.TYPE = this.bossType;
    if (body.ID) {
      return this.db.update(
        {
          columns: body,
          where: {
            ID: body.ID,
          },
        },
        userID,
      );
    } else {
      return this.db.insert({ ...body }, userID);
    }
  }

  async getOperations() {
    return await this.databaseService.search(
      `SELECT ID,
    OPERATION_NAME, -- 工序名稱
    OPERATION_CLASS, -- 操作類型
    OPERATION_CATEGORY,  -- 工序類別
    DESCRIPTION,
    ENABLED
    FROM SFCS_OPERATIONS@DBLINK_MISFCS_SFCS`,
      { cacheTime: 1000 * 60 * 5 },
    );
  }

  getLines() {
    return this.databaseService.search(
      `SELECT ID,
    OPERATION_LINE_NAME, -- 線別名稱
    PLANT_CODE, -- 廠部
    ENABLED
    FROM SFCS_OPERATION_LINES@DBLINK_MISFCS_SFCS`,
      { cacheTime: 1000 * 60 * 5 },
    );
  }

  getParts() {
    return this.databaseService.search(
      `SELECT PART_NO, -- 料號
      CUSTOMER_PN,
      MODEL_ID -- 機種ID
 FROM SFCS_PN@DBLINK_MISFCS_SFCS`,
      { cacheTime: 1000 * 60 * 5 },
    );
  }

  getModels() {
    return this.databaseService.search(
      `SELECT ID,
      MODEL, -- 機種
      DESCRIPTION,
      ENABLED
 FROM SFCS_MODEL@DBLINK_MISFCS_SFCS`,
      { cacheTime: 1000 * 60 * 5 },
    );
  }

  getFamilyNames() {
    return this.databaseService.search(`
    SELECT ID, FAMILY_NAME, DESCRIPTION, ENABLED
    FROM SFCS_PRODUCT_FAMILY@DBLINK_MISFCS_SFCS`,
    { cacheTime: 1000 * 60 * 5 });
  }
}
