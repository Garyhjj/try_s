import { Database } from '../../class/database.class';
import { CommonService } from '../shared/common.service';
import { PoDtlObject, PoDtlEntity } from './po-dtl.dot';
import { Injectable } from '@nestjs/common';
import { toStoreString } from '../../shared/tables';
import { DatabaseService } from '../../core/database.service';

@Injectable()
export class PoDtlService {
  db: Database;
  constructor(private databaseService: DatabaseService) {
    this.db = new Database(PoDtlObject, PoDtlEntity);
  }

  async searchPoDtl(filter: any, pi = 1, ps = 1000) {
    return await this.db.find(filter, pi, ps);
  }

  async getPoStatus(
    po_no: string,
    po_bu: string,
    po_sno: string,
    part_no: string,
    vendor_code: string,
    request_date: string,
  ) {
    po_no = toStoreString(po_no);
    po_bu = toStoreString(po_bu);
    po_sno = toStoreString(po_sno);
    part_no = toStoreString(part_no);
    vendor_code = toStoreString(vendor_code);
    const date_arr = request_date.split(',');
    const date_from = toStoreString(date_arr[0]);
    const date_to = toStoreString(date_arr[1]);

    // tslint:disable-next-line:no-console
    /*     console.log(`SELECT D.PO_NO,D.PO_SNO,D.PART_NO,D.PART_DESC,to_char(D.REQUEST_DATE,'yyyy/mm/dd') REQUEST_DATE,
    D.REQUEST_QTY,D.BALANCE_QTY,D.PO_BU,D.PO_SIC,M.VENDOR_CODE,D.CURRENCY,
    M.VENDOR_NAME,M.BUYER_NAME,DECODE(M.PO_LOCATION,'O','Oversea','L','Local',NVL(M.PO_LOCATION,'N/A')) AS PO_LOCATION,
    MHUB_GET_ONWAY_QTY(D.PO_NO,D.PO_SNO) ONWAY_QTY, D.BALANCE_QTY - MHUB_GET_ONWAY_QTY(D.PO_NO,D.PO_SNO) PO_RES_QTY
     FROM MHUB_PO_DTL D,MHUB_PO_MST M WHERE M.PO_NO=D.PO_NO AND
    M.CUSTOMER_CODE=D.CUSTOMER_CODE
    and (${po_no} is null or d.po_no = ${po_no})
    and (${po_bu} is null or d.po_bu = ${po_bu})
    and (${po_sno} is null or d.po_sno = ${po_sno})
    and (${part_no} is null or d.part_no = ${part_no})
    and (${vendor_code} is null or d.vendor_code = ${vendor_code})
    and (${date_from} is null or d.Request_Date >= to_date(${date_from},'yyyy/mm/dd'))
    and (${date_to} is null or d.Request_Date <= to_date(${date_to},'yyyy/mm/dd')) Order by D.PO_NO,D.PO_SNO`); */
    const sql = `SELECT D.PO_NO,D.PO_SNO,D.PART_NO,D.PART_DESC,to_char(D.REQUEST_DATE,'yyyy/mm/dd') REQUEST_DATE,
    D.REQUEST_QTY,D.BALANCE_QTY,D.PO_BU,D.PO_SIC,M.VENDOR_CODE,D.CURRENCY,
    M.VENDOR_NAME,M.BUYER_NAME,DECODE(M.PO_LOCATION,'O','Oversea','L','Local',NVL(M.PO_LOCATION,'N/A')) AS PO_LOCATION,
    MHUB_GET_ONWAY_QTY(D.PO_NO,D.PO_SNO) ONWAY_QTY, D.BALANCE_QTY - MHUB_GET_ONWAY_QTY(D.PO_NO,D.PO_SNO) PO_RES_QTY
     FROM MHUB_PO_DTL D,MHUB_PO_MST M WHERE M.PO_NO=D.PO_NO AND
    M.CUSTOMER_CODE=D.CUSTOMER_CODE
    and (${po_no} is null or d.po_no = ${po_no})
    and (${po_bu} is null or d.po_bu = ${po_bu})
    and (${po_sno} is null or d.po_sno = ${po_sno})
    and (${part_no} is null or d.part_no = ${part_no})
    and (${vendor_code} is null or d.vendor_code = ${vendor_code})
    and (${date_from} is null or d.Request_Date >= to_date(${date_from},'yyyy/mm/dd'))
    and (${date_to} is null or d.Request_Date <= to_date(${date_to},'yyyy/mm/dd')) Order by D.PO_NO,D.PO_SNO`;
    return this.databaseService
      .execute(sql);
  }
}
