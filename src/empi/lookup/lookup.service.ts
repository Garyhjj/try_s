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
    this.getEmp('').then((res) => console.log(res))
  }

  getLookup({ type }) {
    type = toStoreString(type);
    return this.db.search(`select * from ${EmpiLookupObject.tableName}
      where type = ${type}`);
  }

  deleteLookup(id) {
    return this.db.delete({ where: { ID: id } });
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
    return [
      {OPERATION_NAME: 'NAME1'},
      {OPERATION_NAME: 'NAME2'},
      {OPERATION_NAME: 'NAME3'},
      {OPERATION_NAME: 'NAME4'},
    ];
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
    return [
      {OPERATION_LINE_NAME: 'LINE_NAME1'},
      {OPERATION_LINE_NAME: 'LINE_NAME2'},
      {OPERATION_LINE_NAME: 'LINE_NAME3'},
      {OPERATION_LINE_NAME: 'LINE_NAME4'},
    ];
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
    return [
      {PART_NO: 'PART_NO1'},
      {PART_NO: 'PART_NO2'},
      {PART_NO: 'PART_NO3'},
      {PART_NO: 'PART_NO4'},
    ];
    return this.databaseService.search(
      `SELECT PART_NO, -- 料號
      CUSTOMER_PN,
      MODEL_ID -- 機種ID
 FROM SFCS_PN@DBLINK_MISFCS_SFCS`,
      { cacheTime: 1000 * 60 * 5 },
    );
  }

  getModels() {
    return [
      {MODEL: 'MODEL1'},
      {MODEL: 'MODEL2'},
      {MODEL: 'MODEL4'},
      {MODEL: 'MODEL5'},
    ];
    return this.databaseService.search(
      `SELECT ID,
      MODEL, -- 機種
      DESCRIPTION,
      ENABLED
 FROM SFCS_MODEL@DBLINK_MISFCS_SFCS`,
      { cacheTime: 1000 * 60 * 5 },
    );
  }

  async getFamilyNames() {
    return [
      { FAMILY_NAME: 'FAMILY_NAME1' },
      { FAMILY_NAME: 'FAMILY_NAME2' },
      { FAMILY_NAME: 'FAMILY_NAME3' },
      { FAMILY_NAME: 'FAMILY_NAME4' },
      { FAMILY_NAME: 'FAMILY_NAME5' },
    ];
    return this.databaseService.search(`
    SELECT ID, FAMILY_NAME, DESCRIPTION, ENABLED
    FROM SFCS_PRODUCT_FAMILY@DBLINK_MISFCS_SFCS`,
      { cacheTime: 1000 * 60 * 5 });
  }

  async getEmp(keywork: string) {
    if (!keywork) {
      return [];
    }
    keywork = `'%${keywork}%'`;
    return this.databaseService.search(`
    select * from moa_gl_users where USER_NAME like ${keywork.toLocaleLowerCase()} or NICK_NAME like ${keywork}
    or EMPNO like ${keywork}`);
  }

  async getEmpByUsername(username: string) {
    if (!username) {
      return null;
    }
    username = toStoreString(username);
    return this.databaseService.search(`
    select * from moa_gl_users where USER_NAME = ${username} and rownum = 1`);
  }
}
