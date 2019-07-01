import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { LookupEntity, LookupInterface, LookupObject } from './lookup.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';
import { CacheResult } from '../../shared/decorators';

@Injectable()
export class LookupService {
  db: DatabaseTable;
  constructor(private databaseService: DatabaseService) {
    this.db = this.databaseService.getTableInstance(LookupObject, LookupEntity);
  }

  async getAllLookup() {
    return await this.db.execute(`select * from ${LookupObject.tableName}`);
  }
  @CacheResult(1000 * 10)
  async searchLookups(filter: any, pi = 1, ps = 10) {
    return await this.db.find(filter, pi, ps);
  }

  async getLookupById(id: number) {
    return await this.db.execute(
      `select * from ${LookupObject.tableName} where id =${id}`,
    );
  }

  async getLookupList(list: string) {
    const oldResult = list.split(',');
    const newResult = oldResult.map(v => `'${v}'`);
    return await this.db.execute(
      `select ID,LOOKUP_TYPE,LOOKUP_CODE ,LOOKUP_LABEL ,DESCRIPTION from ${
        LookupObject.tableName
      } where LOOKUP_TYPE in (${newResult.join(',')})`,
    );
  }

  async createLookup(body: LookupInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateLookup(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteLookup(body: UpdateObject) {
    try {
      return await this.db.delete(body);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteLookupById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
