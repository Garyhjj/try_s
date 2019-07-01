import { Database } from './../../class/database.class';
import { AsnDtlEntity, AsnDtlInterface, AsnDtlObject } from './asn-dtl.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '.../../class/update-object.class';

@Injectable()
export class AsnDtlService {
  db: Database;
  constructor() {
    this.db = new Database(AsnDtlObject, AsnDtlEntity);
  }

  async getAllDtl() {
    return await this.db.execute(`select * from ${AsnDtlObject.tableName}`);
  }

  async searchDtls(filter: any, pi = 1, ps = 10) {
    return await this.db.find(filter, pi, ps);
  }

  async getDtlById(id: number) {
    return await this.db.execute(
      `select * from ${AsnDtlObject.tableName} where id =${id}`,
    );
  }

  async createDtl(body: AsnDtlInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
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

  async deleteDtlPallet(dtlId: number) {
    try {
      return await this.db.execute(`
      BEGIN MHUB_ASN_PKG.DELETE_DTL_PALLET(${dtlId}); END;
      `);
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
