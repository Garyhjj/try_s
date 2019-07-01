import { Database } from './../../class/database.class';
import {
  AsnPalletEntity,
  AsnPalletInterface,
  AsnPalletObject,
} from './asn-pallet.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';

@Injectable()
export class AsnPalletService {
  db: Database;
  constructor() {
    this.db = new Database(AsnPalletObject, AsnPalletEntity);
  }

  async getVpartNo() {
    return await this.db.execute(
      `SELECT 'IHVP'||LPAD(MHUB_VPART_SEQ.NEXTVAL,8,'0') vpart FROM DUAL`,
    );
  }

  async getPalletInfo(lotNo: string) {
    const sql = `
    SELECT   CASE
    WHEN A.PALLET_FROM <> A.PALLET_TO
    THEN
       A.PALLET_FROM || '-' || A.PALLET_TO
    ELSE
       TO_CHAR (A.PALLET_FROM)
 END
    PLT_NO,
 CASE
    WHEN A.CARTON_FROM <> A.CARTON_TO
    THEN
       A.CARTON_FROM || '-' || A.CARTON_TO
    ELSE
       TO_CHAR (A.CARTON_FROM)
 END
    CTN_NO,
 B.*,
 A.PART_NO,
 A.PART_DESC,
 A.QUANTITY_UOM,
 A.ORIGIN_COUNTRY,
 round(NVL (A.CARTON_GROSS_WEIGHT * (A.CARTON_TO - A.CARTON_FROM + 1), 0),2)
    AS TOTAL_GROSS_WEIGHT,
 A.TOTAL_QTY AS TOTAL_QTY,
 round(NVL (A.ITEM_NET_WEIGHT * (A.CARTON_TO - A.CARTON_FROM + 1), 0),2)
    AS TOTAL_NET_WEIGHT,
 round(NVL (A.CARTON_CBM, 0),2) AS CARTON_CBM,
 A.ID,
 A.PALLET_ID,
 A.CARTON_FROM,
 A.CARTON_TO,
 A.TOTAL_CASE,
 A.ITEM_NET_WEIGHT,
 A.CARTON_GROSS_WEIGHT,
 A.CARTON_QTY,
 A.ITEM_GROSS_WEIGHT,
 a.origin_country
FROM   MHUB_ASN_DTL A, MHUB_ASN_PALLET B
WHERE       A.LOT_NO = B.LOT_NO
 AND A.LOT_NO = '${lotNo}'
 AND a.pallet_from = b.pallet_from
 AND a.pallet_to = b.pallet_to
ORDER BY   A.PALLET_FROM, A.CARTON_FROM, A.ID`;
    return await this.db.execute(sql);
    //     const sql = `
    //         SELECT CASE
    //     WHEN A.PALLET_FROM <> A.PALLET_TO
    //     THEN
    //       A.PALLET_FROM || '-' || A.PALLET_TO
    //     ELSE
    //       TO_CHAR (A.PALLET_FROM)
    // END
    //     PLT_NO,
    // CASE
    //     WHEN A.CARTON_FROM <> A.CARTON_TO
    //     THEN
    //       A.CARTON_FROM || '-' || A.CARTON_TO
    //     ELSE
    //       TO_CHAR (A.CARTON_FROM)
    // END
    //     CTN_NO,
    // B.*,
    // A.PART_NO,
    // A.PART_DESC,
    // A.QUANTITY_UOM,
    // A.ORIGIN_COUNTRY,
    // NVL (A.CARTON_GROSS_WEIGHT * A.TOTAL_CARTON, 0) AS TOTAL_GROSS_WEIGHT,
    // A.TOTAL_QTY AS TOTAL_QTY,
    // NVL (A.ITEM_NET_WEIGHT * A.TOTAL_CARTON, 0) AS TOTAL_NET_WEIGHT,
    // NVL (A.CARTON_CBM, 0) AS CARTON_CBM,
    // A.ID,
    // A.PALLET_ID,
    // A.CARTON_FROM,
    // A.CARTON_TO,
    // A.TOTAL_CASE,
    // A.ITEM_NET_WEIGHT,
    // A.CARTON_GROSS_WEIGHT,
    // A.CARTON_QTY,
    // A.ITEM_GROSS_WEIGHT,
    // a.origin_country
    // FROM MHUB_ASN_DTL A, MHUB_ASN_PALLET B
    // WHERE A.PALLET_ID = B.ID AND A.LOT_NO = '${lotNo}'
    // ORDER BY A.PALLET_FROM,A.CARTON_FROM,A.ID`;
  }

  async getAllPallet() {
    return await this.db.execute(`select * from ${AsnPalletObject.tableName}`);
  }

  async searchPallets(filter: any, pi = 1, ps = 10) {
    return await this.db.find(filter, pi, ps);
  }

  async getPalletById(id: number) {
    return await this.db.execute(
      `select * from ${AsnPalletObject.tableName} where id =${id}`,
    );
  }

  async createPallet(body: AsnPalletInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async createDtlAndPallet(body: AsnPalletInterface, userId: number) {
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        const element = body[key];
        if (!element) {
          body[key] = 0;
        }
      }
    }

    const sql = `begin MHUB_ASN_PKG.CREATE_DTL_PALLET('${body.LOT_NO}','${
      body.CARTON_FROM
    }','${body.CARTON_TO}','${body.CARTON_QTY}',
    '${body.PART_NO}','${body.CARTON_CBM}','${body.ORIGIN_COUNTRY}','','${
      body.TOTAL_CASE
    }','${body.CARTON_GROSS_WEIGHT}','${body.CARTON_NET_WEIGHT}','${
      body.ITEM_GROSS_WEIGHT
    }','${body.PACKAGE_TYPE}','${body.PALLET_FROM}','${body.PALLET_TO}','${
      body.PALLET_GROSS_WEIGHT
    }','${body.PART_DESC}'
    ); end;`;

    try {
      return await this.db.execute(sql);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updatePallet(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deletePallet(body: UpdateObject) {
    try {
      return await this.db.delete(body);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deletePalletById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getTotalPalletGW(lotNo: string) {
    const sql = `select round(sum(PALLET_GROSS_WEIGHT),2)  gw from mhub_asn_pallet where lot_no='${lotNo}'`;
    const res = await this.db.execute(sql);
    return res;
  }

  async sumPart(lotNo: string) {
    const sql = `
    SELECT   PART_NO,
    SUM (TOTAL_QTY) TOTAL_QTY,
    NVL (SUM (CARTON_GROSS_WEIGHT * TOTAL_CARTON), 0)
       AS TOTAL_GROSS_WEIGHT,
    NVL (SUM (ITEM_NET_WEIGHT * TOTAL_CARTON), 0) AS TOTAL_NET_WEIGHT
FROM   MHUB_ASN_DTL
WHERE   LOT_NO = '${lotNo}'
GROUP BY   PART_NO`;
    const res = await this.db.execute(sql);
    return res;
  }
}
