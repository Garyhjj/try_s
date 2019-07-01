import { CommonService } from './../shared/common.service';
import { Database } from './../../class/database.class';
import { BlDtlEntity, BlDtlInterface, BlDtlObject } from './bl-dtl.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';

@Injectable()
export class BlDtlService {
  db: Database;
  constructor(private commonService: CommonService) {
    this.db = new Database(BlDtlObject, BlDtlEntity);
  }

  async getVendorByPo(po: string) {
    return await this.commonService.getVendorByPo(po);
  }

  async getAllDtl() {
    return await this.db.execute(`select * from ${BlDtlObject.tableName}`);
  }

  async searchDtls(filter: any, pi = 1, ps = 10) {
    return await this.db.find(filter, pi, ps);
  }

  async getDtlById(id: number) {
    return await this.db.execute(
      `select * from ${BlDtlObject.tableName} where id =${id}`,
    );
  }

  async createDtl(body: BlDtlInterface, userId: number) {
    try {
      // 先根据LOT_CODE获取LOT_NO
      /* const lotNoRes = await this.db.execute(
         `SELECT MHUB_MAX_LOTNO_PKG.GET_MAX_LOT_NO('${
           body.LOT_CODE
         }') LOT_NO FROM DUAL`,
       );*/
    } catch (e) {
      throw new Error(e);
    }

    // console.log(body);
    try {
      const res = await this.db.insert(body, userId);
      return body;
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateDtl(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteDtl(body: UpdateObject) {
    try {
      return await this.db.delete(body);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteDtlById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
