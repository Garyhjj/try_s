import { CommonService } from './../shared/common.service';
import { Database } from './../../class/database.class';
import { AsnMstEntity, AsnMstInterface, AsnMstObject } from './asn-mst.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';
import * as oracledb from 'oracledb';
import { UtilService } from '../../core/util.service';

@Injectable()
export class AsnMstService {
  db: Database;
  constructor(private commonService: CommonService, private util: UtilService) {
    this.db = new Database(AsnMstObject, AsnMstEntity);
  }

  async getVendorByPo(po: string) {
    return await this.commonService.getVendorByPo(po);
  }

  async checkPartNo(partNo: string, customer_code: string = '00003') {
    return await this.commonService.checkPartNo(partNo, customer_code);
  }

  async checkPartNo2(partNo: string, customer_code: string = '00003') {
    return await this.commonService.checkPartNo2(partNo, customer_code);
  }

  async getAllMst() {
    return await this.db.execute(`select * from ${AsnMstObject.tableName}`);
  }

  async confirmAsn(lotNo: string) {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN
            MHUB_ASN_PKG.INV_CONFIRM(
                :1,
                :msg
            );
         END;`,
        {
          1: lotNo,
          msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    return result.outBinds.msg;
  }

  async getAllOpenMst(
    lotNo: string,
    pkNo: string,
    pkStatus: string,
    site: string,
  ) {
    const sql = `
    SELECT *
    FROM (  SELECT *
              FROM MHUB_ASN_MST
             WHERE LOT_NO = NVL ('${lotNo}', LOT_NO) AND PK_NO = NVL ('${pkNo}', PK_NO) AND PK_STATUS = NVL ('${pkStatus}', PK_STATUS)
             AND SITE = NVL ('${site}', SITE)
             AND LOT_NO NOT LIKE 'HO%'
          ORDER BY CREATION_DATE DESC)
   WHERE ROWNUM <= 100
ORDER BY CREATION_DATE DESC
    `;
    return await this.db.execute(sql);
  }

  async reOpenMstQuery(lotNo: string, pkNo: string, userId: number) {
    const sql = `
    SELECT *
    FROM (  SELECT *
              FROM MHUB_ASN_MST
             WHERE LOT_NO = NVL ('${lotNo}', LOT_NO) AND PK_NO = NVL ('${pkNo}', PK_NO) AND LOT_NO NOT LIKE 'HO%' AND PK_STATUS in ('4','9')
          ORDER BY CREATION_DATE DESC)
   WHERE ROWNUM <= 50
ORDER BY CREATION_DATE DESC
    `;
    return await this.db.execute(sql);
  }

  async closeQuery(lotNo: string, pkNo: string, userId: number) {
    const sql = `
    SELECT *
              FROM MHUB_ASN_MST
             WHERE LOT_NO = NVL ('${lotNo}', LOT_NO) AND PK_NO = NVL ('${pkNo}', PK_NO) AND  PK_STATUS <>'C'
          ORDER BY CREATION_DATE DESC
    `;
    return await this.db.execute(sql);
  }

  async openLot(lotNo: string, customerCode = '00003', userId: number) {
    const sql = `
    BEGIN
       MHUB_OPEN_ASN_STATUS_PKG.MAIN ('${customerCode}', '${lotNo}', ${userId},:status);
    END;
    `;
    const res = await this.db.execute(sql, {
      status: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    });
    return res.outBinds;
  }

  async modifyLot(lotNo: string, customerCode = '00003') {
    await this.db.execute(
      `update mhub_asn_mst set pk_status = 1 where lot_no = '${lotNo}' and customer_code = '${customerCode}'`,
    );
    await this.db.execute(
      `update mhub_inv_mst set inv_status = 1 where lot_no = '${lotNo}' and customer_code = '${customerCode}'`,
    );
    return 'OK';
  }

  async closeLot(
    lotNo: string,
    customerCode = '00003',
    userId: number,
    remark: string,
  ) {
    const sql = `
    BEGIN
      MHUB_CLOSE_ASN_PRO ('${customerCode}', '${lotNo}', '${remark}', ${userId});
    END;
    `;
    await this.db.execute(sql);
    return 'OK';
  }

  async searchMsts(filter: any, pi = 1, ps = 1000) {
    return await this.db.find(filter, pi, ps);
  }

  async getMstById(id: number) {
    return await this.db.execute(
      `select * from ${AsnMstObject.tableName} where id =${id}`,
    );
  }

  async createMst(body: AsnMstInterface, userId: number) {
    try {
      // 先根据LOT_CODE获取LOT_NO
      const lotNoRes = await this.db.execute(
        `SELECT MHUB_MAX_LOTNO_PKG.GET_MAX_LOT_NO('${
          body.LOT_CODE
        }') LOT_NO FROM DUAL`,
      );
      const lotNo = lotNoRes.rows[0].LOT_NO;
      body.LOT_NO = lotNo;
      body.OLD_LOT_NO = lotNo;
      body.PK_STATUS = '0';
      body.PROCESS_FLAG = '1';
      body.CUSTOMER_CODE = '00003';
      body.PK_KIND = '0';
      body.PK_VERSION = 0;
      body.ORIGIN_SHIP_VIA = body.SHIP_VIA;
      body.TRN_DATE = this.commonService.getDateTime();
      body.DOC_DATE = this.commonService.getDateTime();
      body.MHK_ETA = this.commonService.getDateTime(body.MHK_ETA);

      // 获取KEYIN_MH
      const keyinMhRes = await this.db.execute(`
              SELECT NICK_NAME
          FROM MOA_GL_USERS@DBLINK_MIOA
        WHERE ID = ${userId}
      `);
      body.KEYIN_MH = keyinMhRes.rows[0].NICK_NAME || '';

      // 获取SHIP_TYPE
      const shipTypeRes = await this.db.execute(
        `SELECT MHUB_UTILITY_PKG.GEN_SHIP_TYPE('${
          body.PK_TYPE
        }') SHIP_TYPE FROM DUAL`,
      );
      const shipType = shipTypeRes.rows[0].SHIP_TYPE;
      body.SHIP_TYPE = shipType;
    } catch (e) {
      throw new Error(e);
    }
    try {
      await this.db.insert(body, userId);
      const newAsn = await this.db.find({ LOT_NO: body.LOT_NO });
      if (newAsn.rows.length > 0) {
        return newAsn.rows[0];
      } else {
        return {};
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async getOutAsn(
    customerCode: string,
    buycom: string,
    selCom: string,
    lotCode: string,
    oldLotNo: string,
    lotNo: string,
    partNo: string,
    fDocDate: string,
    tDocDate: string,
    shipVia: string,
    mawb: string,
    hawb: string,
    transNo: string,
    containerNo: string,
    status: string,
    outboundType: string,
  ) {
    let sql = `
             SELECT DECODE (BUYER_COMPANY,
               '00001', 'MIC',
               '00026', 'MCT',
               '00003', 'MSL',
               '')
         BUYER_COMPANY,
         DECODE (SELLER_COMPANY,
               '00001', 'MIC',
               '00026', 'MCT',
               '00003', 'MSL',
               '')
         SELLER_COMPANY,OLD_LOT_NO,LOT_NO,SO_REC,VENDOR_CODE,VENDOR_NAME,SHIP_VIA,
         NVL (TO_CHAR(MHK_ETA,'YYYY-MM-DD'), 'N/A') MHK_ETA,MAWB,TRANS_NO,WAREHOUSE_CODE,ATTENDANT,DOC_DATE,
         DECODE (PK_STATUS,
               '0', '0-未完成',
               '2', '2-已完成',
               '9', '9-已出貨',
               'C', 'C-已結案',
               '')
         PK_STATUS,NVL (OUTBOUND_TYPE, 'N/A') OUTBOUND_TYPE
         FROM MHUB_ASN_MST M
         WHERE PK_KIND = '2'
         AND CUSTOMER_CODE= '${customerCode}'
         AND BUYER_COMPANY= NVL('${buycom}',BUYER_COMPANY)
         AND SELLER_COMPANY= NVL('${selCom}',SELLER_COMPANY)
         AND LOT_CODE= NVL('${lotCode}',LOT_CODE)
         AND OLD_LOT_NO= NVL('${oldLotNo}',OLD_LOT_NO)
         AND LOT_NO= NVL('${lotNo}',LOT_NO)
         AND SHIP_VIA = NVL('${shipVia}',SHIP_VIA)
         AND PK_STATUS = NVL('${status}',PK_STATUS)
         AND OUTBOUND_TYPE = NVL('${outboundType}',OUTBOUND_TYPE)
             `;

    if (!this.util.isNull(hawb)) {
      sql = sql + ` AND HAWB = '${hawb}'`;
    }

    if (!this.util.isNull(mawb)) {
      sql =
        sql +
        `   AND EXISTS (
        SELECT LOT_NO FROM MHUB_ASN_MST MA
        WHERE MA.PK_KIND='0' AND MA.MAWB ='${mawb}'
         AND  MA.LOT_NO = M.OLD_LOT_NO) `;
    }

    if (!this.util.isNull(transNo)) {
      sql = sql + ` AND TRANS_NO = '${transNo}'`;
    }

    if (!this.util.isNull(containerNo)) {
      sql = sql + ` AND WAREHOUSE_CODE = '${containerNo}'`;
    }

    if (!this.util.isNull(fDocDate)) {
      sql = sql + ` AND DOC_DATE >= TO_DATE ('${fDocDate}', 'YYYY-MM-DD')`;
    }

    if (!this.util.isNull(tDocDate)) {
      sql = sql + ` AND DOC_DATE <= TO_DATE ('${tDocDate}', 'YYYY-MM-DD')`;
    }

    if (!this.util.isNull(partNo)) {
      sql =
        sql +
        ` AND EXISTS (SELECT 1  FROM MHUB_ASN_DTL D WHERE PART_NO='${partNo}'  AND D.LOT_NO=M.LOT_NO)`;
    }

    sql =
      sql +
      ` AND ROWNUM<200
    ORDER BY MAWB`;

    return this.db.execute(sql);
  }

  async updateMst(body: UpdateObject, userId: number) {
    try {
      if (body.columns.SHIP_VIA) {
        body.columns.ORIGIN_SHIP_VIA = body.columns.SHIP_VIA;
      }
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteMst(body: UpdateObject) {
    try {
      return await this.db.delete(body);
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

  async getStatus4(param) {
    const customerCode = param.CUSTOMER_CODE || '00003';
    const lotNo = param.LOT_NO || '';
    const pkNo = param.PK_NO || '';
    try {
      return await this.db.execute(`
      SELECT DISTINCT A.LOT_NO,
      A.customer_code,
      B.LOT_NO OUT_LOT_NO,
      B.PK_NO,
      B.DOC_DATE,
      a.SHIP_FROM,
      b.SHIP_VIA,
      A.CURRENCY,
      A.VENDOR_CODE,
      A.VENDOR_NAME,
      B.TOTAL_PACKAGE,
      B.TOTAL_PALLET,
      B.TOTAL_QTY,
      A.PK_STATUS
FROM MHUB_ASN_MST A, MHUB_ASN_MST B
 WHERE     A.LOT_NO = B.OLD_LOT_NO
       AND A.PK_STATUS = '4'
       and B.PK_KIND='2'
       AND A.CUSTOMER_CODE = '${customerCode}'
       AND A.LOT_NO = NVL('${lotNo}',A.LOT_NO)
       AND A.PK_NO = NVL('${pkNo}',A.PK_NO)
       `);
    } catch (e) {
      throw new Error(e);
    }
  }

  async confirmTo9(
    lotNo,
    outLotNo,
    customerCode,
    hawb,
    attendant,
    warehouseCode,
    mhkEtd,
    mhkEta,
  ) {
    let result: any;
    let _customerCode;
    if (this.util.isNull(customerCode)) {
      _customerCode = '00003';
    } else {
      _customerCode = customerCode;
    }
    try {
      result = await this.db.execute(
        `BEGIN
            MHUB_ASN_PKG.CONFIRM_TO_9(
                :1,
                :2,
                :3,
                :4,
                :5,
                :6,
                :7,
                :8,
                :msg
            );
         END;`,
        {
          1: lotNo,
          2: outLotNo,
          3: _customerCode,
          4: hawb,
          5: attendant,
          6: warehouseCode,
          7: mhkEtd,
          8: mhkEta,
          msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    return result.outBinds.msg;
  }

  async getStatus2(param) {
    const customerCode = param.CUSTOMER_CODE || '00003';
    const lotNo = param.LOT_NO || '';
    try {
      const sql = ` SELECT DISTINCT A.LOT_NO,
      A.PK_NO,
      A.DOC_DATE,
      A.SHIP_FROM,
      A.SHIP_VIA,
      A.CURRENCY,
      A.VENDOR_CODE,
      A.VENDOR_NAME,
      A.TOTAL_PACKAGE,
      A.TOTAL_PALLET,
      A.TOTAL_QTY,
      A.PK_STATUS
FROM MHUB_ASN_MST A
 WHERE A.PK_STATUS = '2' AND PK_KIND='0'
       AND A.CUSTOMER_CODE = '${customerCode}'
       AND ('${lotNo}' IS null OR A.LOT_NO = '${lotNo}') `;

      return await this.db.execute(sql);
    } catch (e) {
      throw new Error(e);
    }
  }

  async confirmTo4(lotNo, customerCode = '00003') {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN :ret := MHUB_AUTO_OUTBOUND_PKG.CONFIRM35('${customerCode}','${lotNo}'); END;`,
        { ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 } },
      );
    } catch (e) {
      throw new Error(e);
    }

    return result.outBinds.ret;
  }

  async pkListQuery(
    _lotNo: string,
    _partNo: string,
    _vendorCode: string,
    _dateFrom: string,
    _dateTo: string,
    _pkStatus: string,
    _partialOrWhole: string,
    _customerCode = '00003',
    _pkNo: string,
    _hawb: string,
    _vendorName: string,
    _site: string,
  ) {
    let sql = `
    SELECT DISTINCT AM.BUYER_COMPANY,
       AM.SELLER_COMPANY,
       MHUB_UTILITY_PKG.GET_BU_CODE(AM.LOT_NO) BU_CODE,
       AM.LOT_NO,
       MHUB_UTILITY_PKG.GET_SO_NO(AM.LOT_NO) SO_NO,
       AM.PK_NO,
       AM.DOC_DATE,
       AM.VENDOR_CODE,
       AM.VENDOR_NAME,
       AM.SHIP_VIA,
       AM.MHK_ETA,
       AM.MAWB,
       AM.HAWB,
       AM.TRANS_NO,
       (SELECT WAREHOUSE_CODE FROM MHUB_ASN_MST WHERE PK_KIND = '2' AND OLD_LOT_NO = AM.LOT_NO
        AND rownum = 1) WAREHOUSE_CODE,
       AM.PK_STATUS,
       AM.OUTBOUND_TYPE,
       AM.CREATION_DATE,
       MHUB_UTILITY_PKG.GET_PK_STAUS_DESC(AM.LOT_NO) CLOSEERR,
       MHUB_UTILITY_PKG.GET_LABEL_NO(AM.LOT_NO) LABEL_NO,
       MHUB_UTILITY_PKG.IS_FROM_ESCM(AM.LOT_NO) REMARK,
       MHUB_GET_BUYER(AM.LOT_NO) BUYER_CODE
  FROM MHUB_ASN_MST AM, MHUB_ASN_DTL AD
  WHERE AM.LOT_NO = AD.LOT_NO(+)
  AND AM.CUSTOMER_CODE = AD.CUSTOMER_CODE(+)
  AND AM.LOT_NO NOT LIKE 'HO%'
  AND AM.LOT_NO=NVL('${_lotNo}',AM.LOT_NO)
  AND AM.PK_STATUS=NVL('${_pkStatus}',AM.PK_STATUS)
  AND AM.SITE=NVL(upper('${_site}'),AM.SITE)
  AND AM.CUSTOMER_CODE = '${_customerCode}'
    `;

    if (!this.util.isNull(_partNo)) {
      sql = sql + `AND AD.PART_NO=NVL('${_partNo}',AD.PART_NO)`;
    }

    if (!this.util.isNull(_vendorCode)) {
      sql = sql + ` AND AM.VENDOR_CODE=NVL('${_vendorCode}',AM.VENDOR_CODE)`;
    }

    if (!this.util.isNull(_partialOrWhole)) {
      sql =
        sql +
        ` AND AM.OUTBOUND_TYPE=NVL('${_partialOrWhole}',AM.OUTBOUND_TYPE)`;
    }

    if (!this.util.isNull(_dateFrom)) {
      sql =
        sql +
        ` AND trunc(AM.DOC_DATE) >= TO_DATE ('${_dateFrom}', 'YYYY-MM-DD')`;
    }

    if (!this.util.isNull(_dateTo)) {
      sql =
        sql + ` AND trunc(AM.DOC_DATE) <= TO_DATE ('${_dateTo}', 'YYYY-MM-DD')`;
    }

    if (!this.util.isNull(_pkNo)) {
      sql = sql + ` AND AM.PK_NO ='${_pkNo}'`;
    }

    if (!this.util.isNull(_hawb)) {
      sql = sql + ` AND AM.HAWB ='${_hawb}'`;
    }

    if (!this.util.isNull(_vendorName)) {
      sql = sql + ` AND AM.VENDOR_NAME  like '%${_vendorName}%'`;
    }

    sql += ` ORDER BY AM.CREATION_DATE DESC`;
    const res = await this.db.execute(sql);
    return res.rows;
  }

  async pkInvoiceQuery(
    _lotNo: string,
    _partNo: string,
    _vendorCode: string,
    _dateFrom: string,
    _dateTo: string,
    _invoiceStatus: string,
    _invoiceNo: string,
    _poNo: string,
    _poLine: string,
  ) {
    let sql = `
    select
    a.BUYER_COMPANY,
    a.SELLER_COMPANY,
    a.PK_NO,
    a.DOC_DATE,
    a.KEYIN_MH   as INV_KEYIN_MH,
    a.BU_CODE,
    B.SIC,
    a.LOT_NO,
    a.INV_NO,
    PAYMENT_TERM1,
    a.CURRENCY,
    a.CHARGE_TYPE,
    a.SHIPPING_DATE,
    a.INV_STATUS,
    a.VENDOR_CODE,
    B.PO_NO,
    B.PO_SNO,
    B.RECEIVED_QTY,
    B.PART_NO,
    B.BALANCE_QTY,
    B.HI_NO,
    B.UNIT_PRICE,
    B.AMOUNT,
    B.KPO_NO,
    ASN_MST.VENDOR_NAME,
    ASN_MST.PK_STATUS,
    ASN_MST.IQC_CARTONS,
    ASN_MST.IQC_DATE,
    ASN_MST.SHIPPING_MARK5,
    ASN_MST.KEYIN_MH,
    ASN_MST.SI_NO,
    ASN_MST.SHIP_TYPE,
    ASN_MST.LOT_CODE
from
    MHUB_INV_MST a,
    MHUB_INV_DTL B,
    MHUB_ASN_MST ASN_MST
where
    ASN_MST.LOT_NO = a.LOT_NO
    and ASN_MST.LOT_NO = B.LOT_NO
    and a.CUSTOMER_CODE = B.CUSTOMER_CODE
    and a.INV_NO = B.INV_NO
    `;
    if (!this.util.isNull(_invoiceNo)) {
      sql = sql + ` AND a.inv_no = '${_invoiceNo}'`;
    }

    if (!this.util.isNull(_invoiceStatus)) {
      sql = sql + ` AND a.inv_status = '${_invoiceStatus}'`;
    }
    if (!this.util.isNull(_lotNo)) {
      sql = sql + ` AND a.lot_no = '${_lotNo}'`;
    }
    if (!this.util.isNull(_vendorCode)) {
      sql = sql + ` AND asn_mst.vendor_code = '${_vendorCode}'`;
    }
    if (!this.util.isNull(_invoiceStatus)) {
      sql = sql + ` AND a.inv_status = '${_invoiceStatus}'`;
    }
    if (!this.util.isNull(_partNo)) {
      sql = sql + ` AND b.part_no = '${_partNo}'`;
    }
    if (!this.util.isNull(_poNo)) {
      sql = sql + ` AND b.po_no = '${_poNo}'`;
    }
    if (!this.util.isNull(_poLine)) {
      sql = sql + ` AND b.po_sno = '${_poLine}'`;
    }

    if (!this.util.isNull(_dateFrom)) {
      sql =
        sql +
        ` AND trunc(asn_mst.doc_date) >= TO_DATE ('${_dateFrom}', 'YYYY-MM-DD')`;
    }

    if (!this.util.isNull(_dateTo)) {
      sql =
        sql +
        ` AND trunc(asn_mst.doc_date) <= TO_DATE ('${_dateTo}', 'YYYY-MM-DD')`;
    }
    const res = await this.db.execute(sql);
    return res.rows;
  }

  async performance(firstDay: string) {
    const sql = `
    SELECT '1' TYPE,
    COUNT (*) QTY,
    '' USER_ID,
    '' CREATED_BY,
    TO_CHAR (TRUNC (CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
FROM MHUB_ASN_MST A
WHERE     TRUNC (CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD')
    AND NVL (CREATED_BY, -1) <> -1
    AND LOT_NO NOT LIKE 'HO%'
    GROUP BY  TRUNC (CREATION_DATE)
UNION
SELECT '1' TYPE,
       COUNT (*) QTY,
       '' USER_ID,
       '' CREATED_BY,
       TO_CHAR (TRUNC (CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
  FROM MHUB_ASN_MST A
 WHERE     TRUNC (CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 1
       AND NVL (CREATED_BY, -1) <> -1
       AND LOT_NO NOT LIKE 'HO%'
       GROUP BY  TRUNC (CREATION_DATE)
UNION
SELECT '1' TYPE,
       COUNT (*) QTY,
       '' USER_ID,
       '' CREATED_BY,
       TO_CHAR (TRUNC (CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
  FROM MHUB_ASN_MST A
 WHERE     TRUNC (CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 2
       AND NVL (CREATED_BY, -1) <> -1
       AND LOT_NO NOT LIKE 'HO%'
       GROUP BY  TRUNC (CREATION_DATE)
UNION
SELECT '1' TYPE,
       COUNT (*) QTY,
       '' USER_ID,
       '' CREATED_BY,
       TO_CHAR (TRUNC (CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
  FROM MHUB_ASN_MST A
 WHERE     TRUNC (CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 3
       AND NVL (CREATED_BY, -1) <> -1
       AND LOT_NO NOT LIKE 'HO%'
       GROUP BY  TRUNC (CREATION_DATE)
UNION
SELECT '1' TYPE,
       COUNT (*) QTY,
       '' USER_ID,
       '' CREATED_BY,
       TO_CHAR (TRUNC (CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
  FROM MHUB_ASN_MST A
 WHERE     TRUNC (CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 4
       AND NVL (CREATED_BY, -1) <> -1
       AND LOT_NO NOT LIKE 'HO%'
       GROUP BY  TRUNC (CREATION_DATE)
UNION
SELECT '1' TYPE,
       COUNT (*) QTY,
       '' USER_ID,
       '' CREATED_BY,
       TO_CHAR (TRUNC (CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
  FROM MHUB_ASN_MST A
 WHERE     TRUNC (CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 5
       AND NVL (CREATED_BY, -1) <> -1
       AND LOT_NO NOT LIKE 'HO%'
       GROUP BY  TRUNC (CREATION_DATE)
UNION
SELECT '1' TYPE,
       COUNT (*) QTY,
       '' USER_ID,
       '' CREATED_BY,
       TO_CHAR (TRUNC (CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
  FROM MHUB_ASN_MST A
 WHERE     TRUNC (CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 6
       AND NVL (CREATED_BY, -1) <> -1
       AND LOT_NO NOT LIKE 'HO%'
       GROUP BY  TRUNC (CREATION_DATE)
    `;
    const result = await this.db.execute(sql);

    const sql2 = `
    SELECT '2' TYPE,
    COUNT (*) QTY,
    B.CREATED_BY USER_ID,
    MHUB_GET_LOT_USER_NAME(A.LOT_NO,B.CREATED_BY) CREATED_BY,
    TO_CHAR (TRUNC (A.CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
FROM MHUB_ASN_MST A,            (SELECT   DISTINCT CREATED_BY, LOT_NO, CUSTOMER_CODE
  FROM   MHUB_INV_MST) B
WHERE     A.LOT_NO = B.LOT_NO
    AND A.CUSTOMER_CODE = B.CUSTOMER_CODE
    AND A.PK_STATUS NOT IN ('0', '1')
    AND A.LOT_NO NOT LIKE 'HO%'
    AND NVL(B.CREATED_BY,-1)<> -1
    AND TRUNC (A.CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD')
GROUP BY B.CREATED_BY, TRUNC (A.CREATION_DATE)
UNION ALL
SELECT '2' TYPE,
COUNT (*) QTY,
B.CREATED_BY USER_ID,
MHUB_GET_LOT_USER_NAME(A.LOT_NO,B.CREATED_BY) CREATED_BY,
TO_CHAR (TRUNC (A.CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
FROM MHUB_ASN_MST A,            (SELECT   DISTINCT CREATED_BY, LOT_NO, CUSTOMER_CODE
  FROM   MHUB_INV_MST) B
WHERE     A.LOT_NO = B.LOT_NO
AND A.CUSTOMER_CODE = B.CUSTOMER_CODE
AND A.PK_STATUS NOT IN ('0', '1')
AND A.LOT_NO NOT LIKE 'HO%'
AND NVL(B.CREATED_BY,-1)<> -1
AND TRUNC (A.CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 1
GROUP BY B.CREATED_BY, TRUNC (A.CREATION_DATE)
UNION ALL
SELECT '2' TYPE,
COUNT (*) QTY,
B.CREATED_BY USER_ID,
MHUB_GET_LOT_USER_NAME(A.LOT_NO,B.CREATED_BY) CREATED_BY,
TO_CHAR (TRUNC (A.CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
FROM MHUB_ASN_MST A,            (SELECT   DISTINCT CREATED_BY, LOT_NO, CUSTOMER_CODE
  FROM   MHUB_INV_MST) B
WHERE     A.LOT_NO = B.LOT_NO
AND A.CUSTOMER_CODE = B.CUSTOMER_CODE
AND A.PK_STATUS NOT IN ('0', '1')
AND A.LOT_NO NOT LIKE 'HO%'
AND NVL(B.CREATED_BY,-1)<> -1
AND TRUNC (A.CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 2
GROUP BY B.CREATED_BY, TRUNC (A.CREATION_DATE)
UNION ALL
SELECT '2' TYPE,
COUNT (*) QTY,
B.CREATED_BY USER_ID,
MHUB_GET_LOT_USER_NAME(A.LOT_NO,B.CREATED_BY) CREATED_BY,
TO_CHAR (TRUNC (A.CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
FROM MHUB_ASN_MST A,           (SELECT   DISTINCT CREATED_BY, LOT_NO, CUSTOMER_CODE
  FROM   MHUB_INV_MST) B
WHERE     A.LOT_NO = B.LOT_NO
AND A.CUSTOMER_CODE = B.CUSTOMER_CODE
AND A.PK_STATUS NOT IN ('0', '1')
AND A.LOT_NO NOT LIKE 'HO%'
AND NVL(B.CREATED_BY,-1)<> -1
AND TRUNC (A.CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 3
GROUP BY B.CREATED_BY, TRUNC (A.CREATION_DATE)
UNION ALL
SELECT '2' TYPE,
COUNT (*) QTY,
B.CREATED_BY USER_ID,
MHUB_GET_LOT_USER_NAME(A.LOT_NO,B.CREATED_BY) CREATED_BY,
TO_CHAR (TRUNC (A.CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
FROM MHUB_ASN_MST A,            (SELECT   DISTINCT CREATED_BY, LOT_NO, CUSTOMER_CODE
  FROM   MHUB_INV_MST) B
WHERE     A.LOT_NO = B.LOT_NO
AND A.CUSTOMER_CODE = B.CUSTOMER_CODE
AND A.PK_STATUS NOT IN ('0', '1')
AND A.LOT_NO NOT LIKE 'HO%'
AND NVL(B.CREATED_BY,-1)<> -1
AND TRUNC (A.CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 4
GROUP BY B.CREATED_BY, TRUNC (A.CREATION_DATE)
UNION ALL
SELECT '2' TYPE,
COUNT (*) QTY,
B.CREATED_BY USER_ID,
MHUB_GET_LOT_USER_NAME(A.LOT_NO,B.CREATED_BY) CREATED_BY,
TO_CHAR (TRUNC (A.CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
FROM MHUB_ASN_MST A,            (SELECT   DISTINCT CREATED_BY, LOT_NO, CUSTOMER_CODE
  FROM   MHUB_INV_MST) B
WHERE     A.LOT_NO = B.LOT_NO
AND A.CUSTOMER_CODE = B.CUSTOMER_CODE
AND A.PK_STATUS NOT IN ('0', '1')
AND A.LOT_NO NOT LIKE 'HO%'
AND NVL(B.CREATED_BY,-1)<> -1
AND TRUNC (A.CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 5
GROUP BY B.CREATED_BY, TRUNC (A.CREATION_DATE)
UNION ALL
SELECT '2' TYPE,
COUNT (*) QTY,
B.CREATED_BY USER_ID,
MHUB_GET_LOT_USER_NAME(A.LOT_NO,B.CREATED_BY) CREATED_BY,
TO_CHAR (TRUNC (A.CREATION_DATE), 'YYYY-MM-DD') CREATION_DATE
FROM MHUB_ASN_MST A,            (SELECT   DISTINCT CREATED_BY, LOT_NO, CUSTOMER_CODE
  FROM   MHUB_INV_MST) B
WHERE     A.LOT_NO = B.LOT_NO
AND A.CUSTOMER_CODE = B.CUSTOMER_CODE
AND A.PK_STATUS NOT IN ('0', '1')
AND A.LOT_NO NOT LIKE 'HO%'
AND NVL(B.CREATED_BY,-1)<> -1
AND TRUNC (A.CREATION_DATE) = TO_DATE ('${firstDay}', 'YYYY-MM-DD') + 6
GROUP BY B.CREATED_BY, TRUNC (A.CREATION_DATE)
    `;
    const result2 = await this.db.execute(sql2);
    return {
      wholeQty: result.rows,
      finishQty: result2.rows,
    };
  }

  async performanceDetail(date: string) {
    const sql = `
    SELECT A.LOT_NO,
       A.VENDOR_CODE,
       A.VENDOR_NAME,
       A.CREATION_DATE,
       MHUB_GET_LOT_USER_NAME(A.LOT_NO,MHUB_GET_USER_ID_BY_LOT(A.LOT_NO)) KEY_IN_USER,
       A.TRN_DATE CONFIRM_TO_2_DATE,
       A.PK_STATUS
  FROM MHUB_ASN_MST A
 WHERE     TO_CHAR (TRUNC (A.CREATION_DATE), 'YYYY-MM-DD') = '${date}'
 AND NVL(CREATED_BY,-1)<> -1
AND LOT_NO NOT LIKE 'HO%'
ORDER BY A.CREATION_DATE DESC
    `;
    const res = await this.db.execute(sql);
    return res.rows;
  }
}
