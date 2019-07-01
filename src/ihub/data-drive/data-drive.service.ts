import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { UpdateObject } from '../../class/update-object.class';
import {
  DataDriveEntity,
  DataDriveObject,
  DataDriveInterface,
} from './data-drive.dto';
import { Injectable } from '@nestjs/common';
import { CacheResult } from '../../shared/decorators';

@Injectable()
export class DataDriveService {
  db: DatabaseTable;
  constructor(private databaseService: DatabaseService) {
    this.db = this.databaseService.getTableInstance(
      DataDriveObject,
      DataDriveEntity,
    );
  }

  async getAllDataDrive() {
    return await this.db.execute(`select * from ${DataDriveObject.tableName}`);
  }

  @CacheResult(1000 * 10)
  async searchDataDrives(filter: any, pi = 1, ps = 1000) {
    return await this.db.find(filter, pi, ps);
  }

  async getDataDriveById(id: number) {
    return await this.db.execute(
      `select * from ${DataDriveObject.tableName} where id =${id}`,
    );
  }

  async createDataDrive(body: DataDriveInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getMaxId() {
    try {
      return await this.db.execute(
        `select max(id) id from ${DataDriveObject.tableName}`,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateDataDrive(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteDataDrive(body: UpdateObject) {
    try {
      return await this.db.delete(body);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteDataDriveById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
