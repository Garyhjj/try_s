import { CommonService } from './../shared/common.service';
import { Database } from './../../class/database.class';
import {
  MhubInvoiceListEntity,
  MhubInvoiceListInterface,
  MhubInvoiceListObject,
} from './invlist.dto';
import { Injectable } from '@nestjs/common';
import { UtilService } from '../../core/util.service';
import { async } from 'rxjs/internal/scheduler/async';
import { sortUtils } from '../../shared/utils';

@Injectable()
export class InvListService {
  db: Database;
  constructor(private commonService: CommonService, private util: UtilService) {
    this.db = new Database(MhubInvoiceListObject, MhubInvoiceListEntity);
  }

  async searchMsts(filter: any, pi = 1, ps = 1000) {
    return await this.db.find(filter, pi, ps);
  }

  async getOutInvData(
    customerCode: string,
    buycom: string,
    selCom: string,
    lotNO: string,
    invNO: string,
    oldLotNO: string,
    mawb: string,
    hawb: string,
  ) {
    let sql = `SELECT * FROM (SELECT DISTINCT DECODE (MI.BUYER_COMPANY,
      '00001', 'MIC',
      '00026', 'MCT',
      '00003', 'MSL',
      '')
BUYER_COMPANY,
DECODE (MI.SELLER_COMPANY,
      '00001', 'MIC',
      '00026', 'MCT',
      '00003', 'MSL',
      '')
SELLER_COMPANY,
MA.old_lot_no,
MI.LOT_NO,
MI.DOC_DATE,
MA.ship_via,
MA.vendor_name,
MI.BU_CODE,
CASE
WHEN MA.ship_type = '3'
THEN
    DECODE (MI.PROCESS_FLAG,
            '1', '等待Oracle 抓取資料',
            '2', '等待回壓 Intel Consig PO',
            '3', '已回壓 Intel Consig PO 成功',
            '4', '回壓 Intel Consig PO失敗',
            'N/A')
ELSE
    '不須MSL PO EDI'
END
p_status,
DECODE (MA.pk_status,
      '0', '0-未完成',
      '2', '2-已完成',
      '9', '9-已出貨',
      'C', 'C-已結案',
      '')
PK_STATUS,
DECODE (MI.INV_STATUS,
      '0', '未結',
      '2', '確認',
      '9', '結案',
      '')
INV_STATUS,
DECODE (MA.ship_type,
      '1', 'S3庫',
      '2', 'D1庫',
      '3', 'Consign Parts',
      'N/A')
SHIP_TYPE_DES
FROM MHUB_INV_MST MI, MHUB_asn_mst MA
WHERE     MI.LOT_NO = MA.LOT_NO(+)
AND MI.INV_TYPE = '1'
AND MI.CUSTOMER_CODE = '${customerCode}'
AND MI.BUYER_COMPANY = NVL ('${buycom}', MI.BUYER_COMPANY)
AND MI.SELLER_COMPANY = NVL ('${selCom}', MI.SELLER_COMPANY)
AND MI.LOT_NO = NVL ('${lotNO}', MI.LOT_NO)
AND MI.INV_NO = NVL ('${invNO}', MI.INV_NO)`;

    if (!this.util.isNull(oldLotNO)) {
      sql =
        sql +
        ` AND MI.LOT_NO IN (SELECT LOT_NO FROM MHUB_ASN_MST WHERE OLD_LOT_NO='${oldLotNO}')`;
    }

    if (!this.util.isNull(hawb)) {
      sql += ` AND EXISTS (SELECT 1
         FROM MHUB_ASN_MST B
         WHERE  B.PK_KIND='2'
         AND B.HAWB='${hawb}'
         AND B.LOT_NO= MA.LOT_NO)`;
    }

    if (!this.util.isNull(mawb)) {
      sql += ` AND EXISTS (SELECT 1
         FROM MHUB_ASN_MST C
         WHERE  C.PK_KIND='0'
         AND C.MAWB='${mawb}'
         AND C.LOT_NO= MA.OLD_LOT_NO)`;
    }

    sql = sql + ') ORDER BY DOC_DATE DESC';
    return await this.db.execute(sql);
  }

  async getInvHeaData(lotNO: string, invNO: string) {
    return await this.db.execute(
      `SELECT SELLER_COMPANY,BUYER_COMPANY,PK_NO,INV_NO,PK_VERSION,LOT_NO,
       TO_CHAR(DOC_DATE,'YYYY-MM-DD') DOC_DATE,CURRENCY,DELIVERY_TERM,CHARGE_TYPE,PAYMENT_TERM1,
       PAYMENT_AMOUNT1,PAYMENT_TERM2,PAYMENT_AMOUNT2,FOB_CHARGE,TOTAL_CHARGE,INSURANCE_AMOUNT,
       FREIGHT_AMOUNT,TO_CHAR(TRN_DATE,'YYYY-MM-DD') TRN_DATE,TO_CHAR(CLOSE_DATE,'YYYY-MM-DD') CLOSE_DATE,
       TO_CHAR(KEYINFINISH_DATE,'YYYY-MM-DD') KEYINFINISH_DATE,BU_CODE,DECODE (INV_STATUS,
        '0', '未結',
        '2', '確認',
        '9', '結案',
        '') INV_STATUS,SHIP_TYPE
       FROM MHUB_INV_MST WHERE INV_NO='${invNO}' AND LOT_NO='${lotNO}' `,
    );
  }

  async getInvDtlData(lotNo: string, invNo: string) {
    return await this.db.execute(
      `  SELECT MI.INV_SNO,
      MI.PART_NO,
      MI.VENDOR_CODE,
      MI.KPO_NO,
      MI.PO_NO,
      MI.PO_SNO,
      (SELECT TO_CHAR (REQUEST_DATE, 'YYYY-MM-DD')
         FROM MHUB_PO_DTL
        WHERE PO_NO = MI.PO_NO AND PO_SNO = MI.PO_SNO)
         PO_DUA_DATE,
      MI.MSL_PO_NO,
      MI.MSL_PO_SNO,
      MP.BUYER_NAME,
      MI.RECEIVED_QTY,
      MI.UNIT_PRICE,
      MI.AMOUNT
 FROM MHUB_INV_DTL MI, MHUB_PO_MST MP
WHERE     MI.PO_NO = MP.PO_NO(+) AND MI.INV_NO='${invNo}' AND MI.LOT_NO='${lotNo}'
ORDER BY INV_SNO`,
    );
  }

  async createData(outLotNo: string, userId: number) {
    try {
      await this.db.execute(
        `BEGIN
        MHUB_OUTBOUND_PK_INV_PKG.CREATE_INVOICE(
          '${outLotNo}'
      );
      END;`,
      );
    } catch (e) {
      throw new Error(e);
    }
    return 'Y';
  }

  async getListByLot(LOT_NO: string) {
    return await this.db.execute(
      `select MI.*,
      CASE
        WHEN UNIT_PRICE = 0 THEN
         round(MBDS_PUB_COMMON_PKG.GET_CUSTOM_PRICE_BYPNORGNO@R12ERP(PART_NO,
                                                                     NULL,
                                                                     'MSL',
                                                                     ADD_MONTHS(SYSDATE,
                                                                                -6),
                                                                     SYSDATE,
                                                                     'I',
                                                                     'USD',
                                                                     'Y'),
               5)
        ELSE
         0
      END AVG_PRICE from ${
      MhubInvoiceListObject.tableName
      } MI where LOT_NO ='${LOT_NO}'
      order by PART_NO,ID`,
    );
  }

  async updateMst(body: MhubInvoiceListInterface[], userId: number) {
    let rowsAffected = 0;
    try {
      // body.forEach(async (row: MhubInvoiceListInterface) => {
      // });
      const res = await Promise.all(
        body.map(d => {
          if (!this.util.isNull(d.ID)) {
            return this.db.execute(
              `UPDATE MHUB_INVOICE_LIST
                   SET UNIT_PRICE= ${d.UNIT_PRICE},AMOUNT= ROUND( ${
              d.UNIT_PRICE
              } *  ${d.RECEIVED_QTY}, 2),
            PART_DESC = '${d.PART_DESC}',
            HS_CODE_T = '${d.HS_CODE_T}',
            FLAG = 'N',
                       LAST_UPDATE_DATE = SYSDATE,
                       LAST_UPDATED_BY =  ${userId}
                   WHERE ID = ${d.ID}`,
            );
          } else {
            return this.db.execute(
              `BEGIN
            MHUB_OUTBOUND_PK_INV_PKG.INSERT_INVOICE(
            '${d.LOT_NO}',
            '${d.PART_NO}',
            '${d.PART_DESC}',
            '${d.ORIGIN_COUNTRY}',
            ${d.RECEIVED_QTY},
            ${d.TOTAL_GROSS_WEIGHT},
            ${d.UNIT_PRICE},
            '${d.SPAREREMARK}',
            '${d.HS_CODE_T}'
            );
            END;`,
            );
          }
        }),
      );

      if (res) {
        res.forEach((r: any) => {
          rowsAffected += r.rowsAffected || '0';
        });
      }

      return { rowsAffected };
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteMstById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateWeight(outLotNo: string, userId: number) {
    try {
      await this.db.execute(
        `BEGIN
        MHUB_OUTBOUND_PK_INV_PKG.UPDATE_WEIGHT_FROM_PACKING(
          '${outLotNo}'
      );
      END;`,
      );
    } catch (e) {
      throw new Error(e);
    }
    return 'Y';
  }

  async updateStatus(outLotNo: string, userId: number) {
    try {
      await this.db.execute(
        `BEGIN
        MHUB_OUTBOUND_PK_INV_PKG.UPDATE_INVOICE_STATUS(
          '${outLotNo}'
      );
      END;`,
      );
    } catch (e) {
      throw new Error(e);
    }
    return 'Y';
  }

  async getInvHea(lotNo: string) {
    try {
      return await this.db.execute(
        `SELECT DISTINCT A.BUYER_COMPANY,
        (SELECT vendor_name
          FROM mhub_asn_mst
         WHERE LOT_NO = A.LOT_NO)
          vendor_name,
        TO_CHAR (A.DOC_DATE, 'YYYY/MM/DD') DOC_DATE,
        A.PK_NO,
        A.LOT_NO,
        B.SITE
      FROM MHUB_INV_MST A , MHUB_ASN_MST B
      WHERE A.LOT_NO = B.LOT_NO
      AND A.LOT_NO = '${lotNo}' AND A.INV_TYPE = '1'`,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async getPrintInvDtl(lotNo: string) {
    try {
      return await this.db.execute(
        `  SELECT v.*,
            'MAKER:' || V.MAKER_NAME || '<BR/>' || 'MAKER_PN:' || V.MAKER_PN
              AS MAKER_INFO
      FROM (  SELECT LOT_NO,
                      PART_NO,
                      PART_DESC,
                      ORIGIN_COUNTRY,
                      SUM (RECEIVED_QTY) RECEIVED_QTY,
                      SUM (NVL (TOTAL_GROSS_WEIGHT, 0)) TOTAL_GROSS_WEIGHT,
                      UNIT_PRICE,
                      ROUND (SUM (AMOUNT), 2) AMOUNT,
                      MAKER_NAME,
                      MAKER_PN,
                      HS_CODE_T
                FROM MHUB_INVOICE_LIST
                WHERE LOT_NO = '${lotNo}'
            GROUP BY LOT_NO,
                      part_no,
                      PART_DESC,
                      unit_price,
                      ORIGIN_COUNTRY,
                      TOTAL_GROSS_WEIGHT,
                      MAKER_NAME,
                      MAKER_PN,
                      HS_CODE_T) v
    ORDER BY PART_NO`,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async getReportInf(query) {
    try {
      const { lotNo, oldLotNo, hawb, mawb } = query;
      let sql = `SELECT DISTINCT BUYER_COMPANY,
        (SELECT VENDOR_NAME
          FROM MHUB_ASN_MST
         WHERE LOT_NO = A.LOT_NO)
          VENDOR_NAME,
          (SELECT OLD_LOT_NO
            FROM MHUB_ASN_MST
           WHERE LOT_NO = A.LOT_NO)
            OLD_LOT_NO,
                    (SELECT HAWB
            FROM MHUB_ASN_MST
           WHERE LOT_NO = A.LOT_NO)
            HAWB,
           (SELECT SITE
              FROM MHUB_ASN_MST
             WHERE LOT_NO = A.LOT_NO)
              SITE,
        TO_CHAR (DOC_DATE, 'YYYY/MM/DD') DOC_DATE,
        PK_NO,
        LOT_NO
      FROM MHUB_INV_MST A
      WHERE INV_TYPE = '1' `;

      if (!this.util.isNull(lotNo)) {
        sql += `AND EXISTS (SELECT 1
          FROM TABLE(SPLIT('${lotNo}', ',')) C
         WHERE C.COLUMN_VALUE = A.LOT_NO)`;
      }

      if (!this.util.isNull(oldLotNo)) {
        sql += ` AND EXISTS (SELECT 1
          FROM MHUB_ASN_MST ma
          WHERE PK_KIND = '2'
          AND EXISTS (SELECT 1
                   FROM TABLE(SPLIT('${oldLotNo}', ',')) A
                  WHERE A.COLUMN_VALUE = ma.old_lot_no)
          AND MA.LOT_NO = A.LOT_NO)`;
      }

      if (!this.util.isNull(hawb)) {
        sql += ` AND EXISTS (SELECT 1
           FROM MHUB_ASN_MST B
           WHERE  B.PK_KIND='2'
           AND B.HAWB='${hawb}'
           AND B.LOT_NO= A.LOT_NO)`;
      }

      if (!this.util.isNull(mawb)) {
        sql += ` AND EXISTS (SELECT 1
           FROM MHUB_ASN_MST I , MHUB_ASN_MST O
           WHERE I.LOT_NO = O.OLD_LOT_NO
           AND O.PK_KIND='2'
           AND I.PK_KIND='0'
           AND I.MAWB='${mawb}'
           AND O.LOT_NO= A.LOT_NO)`;
      }

      const detail = (lot_no: string) =>
        `SELECT v.*,
        'MAKER:' || V.MAKER_NAME || '<BR/>' || 'MAKER_PN:' || V.MAKER_PN
          AS MAKER_INFO
  FROM (  SELECT LOT_NO,
                  PART_NO,
                  PART_DESC,
                  ORIGIN_COUNTRY,
                  SUM (RECEIVED_QTY) RECEIVED_QTY,
                  SUM (NVL (TOTAL_GROSS_WEIGHT, 0)) TOTAL_GROSS_WEIGHT,
                  UNIT_PRICE,
                  ROUND (SUM (AMOUNT), 2) AMOUNT,
                  MAKER_NAME,
                  MAKER_PN,
                  HS_CODE_T
            FROM MHUB_INVOICE_LIST
            WHERE LOT_NO = '${lot_no}'
        GROUP BY LOT_NO,
                  part_no,
                  PART_DESC,
                  unit_price,
                  ORIGIN_COUNTRY,
                  TOTAL_GROSS_WEIGHT,
                  MAKER_NAME,
                  MAKER_PN,
                  HS_CODE_T) v
ORDER BY PART_NO`;

      return this.db.execute(sql).then(r => {
        const ls: any[] = r.rows;
        const nLs = [];
        const rq = [];
        let partNumberDetail;
        ls.reduce((a, b) => {
          a.push(
            this.db.execute(detail(b.LOT_NO)).then(r1 => {
              const res = r1.rows;
              let totalAmount = 0,
                totalWeight = 0,
                totalQty = 0;
              res.forEach(d => {
                d.TOTAL_GROSS_WEIGHT = Number(d.TOTAL_GROSS_WEIGHT.toFixed(2));
                d.AMOUNT = Number(d.AMOUNT.toFixed(2));
                d.RECEIVED_QTY = Number(d.RECEIVED_QTY.toFixed(2));
                d.UNIT_PRICE = Number(d.UNIT_PRICE.toFixed(5));
                totalAmount += d.AMOUNT;
                totalQty += d.RECEIVED_QTY;
                totalWeight += d.TOTAL_GROSS_WEIGHT;
              });
              totalQty = Number(totalQty.toFixed(2));
              totalWeight = Number(totalWeight.toFixed(2));
              totalAmount = Number(totalAmount.toFixed(2));

              const re: any = Object.assign(b, {
                totalQty,
                totalWeight,
                totalAmount,
              });
              if (res.length > 0) {
                nLs.push(Object.assign(re, { lines: res }));
              } else {
                if (!partNumberDetail) {
                  partNumberDetail = { lines: '' };
                }
                nLs.push(Object.assign({}, partNumberDetail, re));
              }
            }),
          );
          return a;
        }, rq);
        return Promise.all(rq).then(() => {
          nLs.sort((a, b) =>
            sortUtils.byCharCode(a.OLD_LOT_NO, b.OLD_LOT_NO, true),
          );
          return nLs;
        });
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
