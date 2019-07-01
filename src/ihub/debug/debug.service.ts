import { CommonService } from './../shared/common.service';
import { Database } from './../../class/database.class';
import { DebugEntity, DebugInterface, DebugObject } from './debug.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';
import * as oracledb from 'oracledb';
import { UtilService } from '../../core/util.service';

import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';

@Injectable()
export class DebugService {
  db: Database;
  db2: DatabaseTable;
  constructor(private databaseService: DatabaseService) {
    this.db = new Database(DebugObject, DebugEntity);
    this.db2 = this.databaseService.getTableInstance(DebugObject, DebugEntity);
  }

  async getAsnByLotNo(lotNo: string) {
    return await this.db.execute(
      `select * from mhub_asn_mst where lot_no ='${lotNo}'`,
    );
  }

  async getAsnByLotNo2(lotNo: string) {
    return await this.db2.search(
      `select * from mhub_asn_mst where lot_no ='${lotNo}'`,
    );
  }
}
