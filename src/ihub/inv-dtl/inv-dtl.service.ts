import { Database } from './../../class/database.class';
import { InvDtlEntity, InvDtlInterface, InvDtlObject } from './inv-dtl.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';

@Injectable()
export class InvDtlService {
  db: Database;
  constructor() {
    this.db = new Database(InvDtlObject, InvDtlEntity);
  }

  async getAllInvDtl() {
    return await this.db.execute(`select * from ${InvDtlObject.tableName}`);
  }

  async searchInvDtls(filter: any, pi = 1, ps = 10) {
    return await this.db.find(filter, pi, ps);
  }

  async getInvDtlById(id: number) {
    return await this.db.execute(
      `select * from ${InvDtlObject.tableName} where id =${id}`,
    );
  }

  async createInvDtl(body: InvDtlInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async insertInvDtl(
    lotNo: string,
    poNumber: string,
    poSno: string,
    bu: string,
    qty: number,
    invNo: string,
    kpoNo: string,
    kpoSno: string,
  ) {
    try {
      const r = await this.db
        .execute(`SELECT MHUB_ASN_PKG.CHECK_BEFORE_INSERT_INV_DTL('${lotNo}','${poNumber}','${poSno}','${bu}',${qty},'${invNo}')
      result from dual `);
      if (r.rows.length > 0 && r.rows[0].RESULT === 'OK') {
        await this.db.execute(
          `BEGIN MHUB_ASN_PKG.CREATE_INV_DTL('${lotNo}','${poNumber}','${poSno}','${bu}',${qty},'${invNo}','${kpoNo}','${kpoSno}'); END; `,
        );
        return 'OK';
      } else {
        return r.rows[0].RESULT || 'insertInvDtl Error';
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async checkBeforeInsertInvDtl(
    lotNo: string,
    poNumber: string,
    poSno: string,
    bu: string,
    qty: number,
    invNo: string,
  ) {
    try {
      const r = await this.db
        .execute(`SELECT MHUB_ASN_PKG.CHECK_BEFORE_INSERT_INV_DTL('${lotNo}','${poNumber}','${poSno}','${bu}',${qty},'${invNo}')
      result from dual `);
      if (r.rows.length > 0 && r.rows[0].RESULT === 'OK') {
        return 'OK';
      } else {
        return r.rows[0].RESULT || 'insertInvDtl Error';
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateInvDtl(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteInvDtl(body: UpdateObject) {
    try {
      return await this.db.delete(body);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteInvDtlById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
