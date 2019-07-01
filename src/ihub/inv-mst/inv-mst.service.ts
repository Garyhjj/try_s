import { Database } from './../../class/database.class';
import { InvMstEntity, InvMstInterface, InvMstObject } from './inv-mst.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';
import { UtilService } from '../../core/util.service';

@Injectable()
export class InvMstService {
  db: Database;
  constructor(private util: UtilService) {
    this.db = new Database(InvMstObject, InvMstEntity);
  }

  async getAllInvMst() {
    return await this.db.execute(`select * from ${InvMstObject.tableName}`);
  }

  async searchInvMsts(filter: any, pi = 1, ps = 10) {
    return await this.db.find(filter, pi, ps);
  }

  async getInboundInvMst(lotNo: string, invNo: string, customerCode = '00003') {
    const sql = `
    SELECT *
    FROM (  SELECT *
              FROM MHUB_INV_MST
             WHERE LOT_NO = NVL ('${lotNo}', LOT_NO) AND INV_NO = NVL ('${invNo}', INV_NO) AND LOT_NO NOT LIKE 'HO%'
             and CUSTOMER_CODE='${customerCode}'
          ORDER BY CREATION_DATE DESC)
   WHERE ROWNUM <= 50
ORDER BY CREATION_DATE DESC
    `;
    return await this.db.execute(sql);
  }

  async getInvMstById(id: number) {
    return await this.db.execute(
      `select * from ${InvMstObject.tableName} where id =${id}`,
    );
  }

  async createInvMst(body: InvMstInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async checkBeforeInsert(body: InvMstInterface) {
    try {
      const sql = `SELECT MHUB_ASN_PKG.CHECK_BEFORE_INSERT_INV_MST ('${
        body.LOT_NO
      }', '${body.INV_NO}') RESULT FROM DUAL`;
      return await this.db.execute(sql);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateInvMst(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteInvMst(body: UpdateObject) {
    try {
      return await this.db.delete(body);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteInvMstById(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getPoLineIntel(itemNo: string) {
    const sql = `select * from  mhub_po_dtl where part_no ='${itemNo}' and customer_code ='00003' and PO_STATUS='0'`;
    return await this.db.execute(sql);
  }

  async getPoLines(
    poNumber: string,
    itemNo: string,
    bu: string,
    customerCode = '00003',
  ) {
    try {
      const sql = `
      SELECT A.PO_SNO,
      A.UNIT_PRICE,
      A.CURRENCY,
      A.REQUEST_QTY,
      A.BALANCE_QTY,
      A.RECEIVED_DATE,
      A.PO_BU,
      A.PO_SIC,
      A.VENDOR_CODE,
      MHUB_ASN_PKG.GET_ONWAY_QTY(A.PO_NO,A.PO_SNO) ONWAY_QTY,
      A.VENDOR_PRODUCT_NUM,
      A.PART_NO,
      MHUB_ASN_PKG.GET_RCV_QTY(A.PO_NO,A.PO_SNO) RECEIVED_QTY
 FROM MHUB_PO_DTL A
WHERE A.PO_NO = '${poNumber}'
      AND A.PO_STATUS = '0'
      AND A.PART_NO = '${itemNo}'
      AND A.BALANCE_QTY <> 0
GROUP BY A.PO_SNO,
      A.UNIT_PRICE,
      A.CURRENCY,
      A.REQUEST_QTY,
      A.BALANCE_QTY,
      A.RECEIVED_DATE,
      A.PO_BU,
      A.PO_SIC,
      A.VENDOR_CODE,
      MHUB_ASN_PKG.GET_ONWAY_QTY(A.PO_NO,A.PO_SNO),
      A.VENDOR_PRODUCT_NUM,
      A.PART_NO,
      MHUB_ASN_PKG.GET_RCV_QTY(A.PO_NO,A.PO_SNO)
      order by A.PO_SNO
      `;
      return await this.db.execute(sql);
    } catch (e) {
      throw new Error(e);
    }
  }

  async invListQuiry(
    seller: string,
    buyer: string,
    invNo: string,
    invStatus: string,
    lotNo: string,
    vendorCode: string,
    dateFrom: string,
    dateTo: string,
    partNo: string,
    poNo: string,
    poSno: string,
    pkNo: string,
    site: string,
  ) {
    let sql = `SELECT
    A.BUYER_COMPANY,
    A.SELLER_COMPANY,
    A.PK_NO,
    A.DOC_DATE,
    MHUB_GET_USER_NAME(A.CREATED_BY)   AS INV_KEYIN_MH,
    A.BU_CODE,
    B.SIC,
    A.LOT_NO,
    A.INV_NO,
    PAYMENT_TERM1,
    A.CURRENCY,
    A.CHARGE_TYPE,
    A.SHIPPING_DATE,
    A.INV_STATUS,
    A.VENDOR_CODE,
    B.PO_NO,
    B.PO_SNO,
    B.RECEIVED_QTY,
    B.PART_NO,
    B.BALANCE_QTY,
    B.HI_NO,
    B.UNIT_PRICE,
    B.AMOUNT,
    B.KPO_NO,
    C.VENDOR_NAME,
    C.PK_STATUS,
    C.IQC_CARTONS,
    C.IQC_DATE,
    C.SHIPPING_MARK5,
    C.KEYIN_MH,
    C.SI_NO,
    C.SHIP_TYPE,
    C.LOT_CODE,
    (SELECT
      SUM(received_qty) received_qty
  FROM
      mhub_aa_mst
  WHERE
      lot_no = A.LOT_NO
      AND part_no = B.PART_NO
      AND kpo_no = B.PO_NO
      AND kpo_sno = B.PO_SNO
  GROUP BY
      process_flag) erp_received_qty,
      (select shortage_qty from MHUB_SHORTAGE where lot_no=A.LOT_NO and part_no =B.PART_NO and hi_no=B.HI_NO ) dz_qty,
      (select cross_reference from MHUB_ITEM_CROSS_REFERENCE where ATTRIBUTE7=B.PO_NO and ATTRIBUTE1=A.VENDOR_CODE) CROSS_REFERENCE
FROM
    MHUB_INV_MST A,
    MHUB_INV_DTL B,
    MHUB_ASN_MST C
WHERE
    C.LOT_NO = A.LOT_NO
    AND C.LOT_NO = B.LOT_NO
    AND A.CUSTOMER_CODE = B.CUSTOMER_CODE
    AND A.LOT_NO NOT LIKE 'HO%'
    AND A.INV_NO = B.INV_NO`;
    if (!this.util.isNull(pkNo)) {
      sql = sql + ` AND c.pk_no = '${pkNo}'`;
    }

    if (!this.util.isNull(seller)) {
      sql = sql + ` AND a.seller_company = '${seller}'`;
    }
    if (!this.util.isNull(buyer)) {
      sql = sql + ` AND a.buyer_company = '${buyer}'`;
    }
    if (!this.util.isNull(invNo)) {
      sql = sql + ` and a.inv_no  = '${invNo}'`;
    }
    if (!this.util.isNull(invStatus)) {
      sql = sql + ` AND a.inv_status = '${invStatus}'`;
    }
    if (!this.util.isNull(lotNo)) {
      sql = sql + ` AND a.lot_no = '${lotNo}'`;
    }
    if (!this.util.isNull(vendorCode)) {
      sql = sql + ` AND c.vendor_code = '${vendorCode}'`;
    }

    if (!this.util.isNull(dateFrom)) {
      sql =
        sql + ` AND trunc(c.doc_date) >= TO_DATE ('${dateFrom}', 'YYYY-MM-DD')`;
    }

    if (!this.util.isNull(dateTo)) {
      sql =
        sql + ` AND trunc(c.doc_date) <= TO_DATE ('${dateTo}', 'YYYY-MM-DD')`;
    }
    if (!this.util.isNull(partNo)) {
      sql = sql + ` AND b.part_no = '${partNo}'`;
    }
    if (!this.util.isNull(poNo)) {
      sql = sql + ` AND b.po_no = '${poNo}'`;
    }
    if (!this.util.isNull(poSno)) {
      sql = sql + ` AND b.po_sno = '${poSno}'`;
    }

    if (!this.util.isNull(site)) {
      sql = sql + ` AND c.site = '${site}'`;
    }
    return await this.db.execute(sql);
  }
}
