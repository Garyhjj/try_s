import { Database } from './../../class/database.class';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as moment from 'moment';
import { toStoreString, toStoreDate } from '../../shared/tables';

@Injectable()
export class CommonService {
  db: Database;
  constructor() {
    this.db = new Database();
  }

  async getVendorByPo(po: string) {
    return this.db.execute(`
      SELECT A.CUSTOMER_CODE,
       A.FACTORY_CODE,
       A.VENDOR_CODE,
       A.VENDOR_NAME,
       B.PO_SIC,
       A.PO_NO,
       A.ATTRIBUTE19 DELIVERY_TERM,
       B.PO_BU
  FROM MHUB_PO_MST A,
       (SELECT DISTINCT PO_NO, PO_SIC, PO_BU
          FROM MHUB_PO_DTL
         WHERE PO_NO = '${po}' AND PO_STATUS = '0') B
 WHERE A.PO_NO = B.PO_NO AND A.PO_NO = '${po}'
 `);
  }

  async checkPartNo(partNo: string, customer_code: string) {
    const res = await this.db.execute(`
  SELECT DISTINCT PART_NO,VENDOR_CODE
    FROM MHUB_PO_DTL
   WHERE     PART_NO = '${partNo}'
        AND CUSTOMER_CODE = '${customer_code}'
        AND PO_STATUS ='0'
        AND ROWNUM = 1
       `);
    if (res.rows.length > 0) {
      return res.rows;
    } else {
      const res2 = await this.db.execute(`
      SELECT DISTINCT PART_NO,VENDOR_CODE
        FROM MHUB_PO_DTL
       WHERE     VPART_NO = '${partNo}'
            AND CUSTOMER_CODE = '${customer_code}'
            AND PO_STATUS ='0'
            AND ROWNUM = 1
           `);
      if (res2.rows.length > 0) {
        return res2.rows;
      } else {
        const res3 = await this.db.execute(`
        select PART_NO,'' VENDOR_CODE from MHUB_SYSTEM_ITEMS where part_no ='${partNo}'  and customer_code ='${customer_code}'  and rownum =1 `);
        if (res3.rows.length > 0) {
          return res3.rows;
        }
      }
    }
    return [];
  }

  async checkPartNo2(partNo: string, customer_code: string) {
    const sql = `select part_no from MHUB_SYSTEM_ITEMS where part_no ='${partNo}'  and customer_code ='${customer_code}'  and rownum =1    `;
    const res = await this.db.execute(sql);
    return res.rows;
  }

  getDateTime(date?: string, format: string = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) {
      date = moment(new Date()).format(format);
    }
    const d = moment(date).format(format);
    return d.toLocaleString();
  }

  async getItemNoByPoNumber(poNumber: string, lotNo: string) {
    const res = await this.db.execute(`
    SELECT DISTINCT PART_NO
    FROM MHUB_PO_DTL
   WHERE PO_NO = '${poNumber}'  AND PO_STATUS = '0'
   and vendor_code = (select vendor_code from mhub_asn_mst where lot_no ='${lotNo}')`);
    //   const res = await this.db.execute(`
    //   SELECT DISTINCT PART_NO
    //   FROM MHUB_PO_DTL
    //  WHERE PO_NO = '${poNumber}' AND CUSTOMER_CODE = '${customerCode}' AND PO_STATUS = '0'`);
    if (res.rows.length > 0) {
      return res;
    }
    return [];
  }

  async GetImportMaterielReport(
    lot_no: string,
    so_no: string,
    mhk_etd: string,
    site: string,
  ) {
    lot_no = toStoreString(lot_no);
    so_no = toStoreString(so_no);
    site = toStoreString(site);
    const date_arr = mhk_etd.split(',');
    const date_from = toStoreString(date_arr[0]);
    const date_to = toStoreString(date_arr[1]);
    const ata_msl_f = toStoreDate(date_arr[0], 'yyyymmdd', 'YYYYMMDD');

    let sql = `select * from ( `;
    // 有outbound

    sql =
      sql +
      `SELECT DISTINCT SO.SO_NO,INA.LOT_NO,MHUB_GET_INV_INFO(INA.LOT_NO,'BU') BU,NVL(SO.VENDOR_NAME,INA.VENDOR_NAME) VENDOR_NAME,
    SO.SHIP_VIA SHIP_TYPE,TO_CHAR(OUTA.MHK_ETD,'yyyy/mm/dd') ATD_HK,NVL(SO.PACKAGE_NO,INA.TOTAL_CARTON) TOTAL_CARTON,
    NVL(SO.TOTAL_PALLET,INA.TOTAL_PALLET) TOTAL_PALLET,SO.WEIGHT,'N/A' CBM,
    ML.MEASURE CKS_CBM,MHUB_GET_BUYER(INA.LOT_NO) BUYER,INA.DELIVERY_TERM,NVL(SO.DELIV_PLA,INA.SHIP_FROM) SHIP_FROM,
    NVL(SO.CONNECT_FWD,INA.SHIPPING_MARK2) FORWARDER,NVL(INA.ORIGIN_SHIP_VIA,INA.SHIP_VIA) VENDOR_SHIP_TYPE,
    INA.TRANS_NO FLT_NO,SO.MAWB,SO.HAWB,SO.SERVICE_REQUIRED COLLECT,
    OUTA.MAWB BL_NO,OUTA.WAREHOUSE_CODE CONTAINER_NO , OUTA.ATTENDANT, OUTA.SECOND_FWD , OUTA.SECOND_FWD_ETA,OUTA.LOT_NO OUT_LOT_NO
    FROM MHUB_SO_DTL SD,MHUB_SO_MST SO ,MHUB_ASN_MST INA,MHUB_ASN_MST OUTA,MHUB_LABEL ML
    WHERE SD.SO_NO=SO.SO_NO(+)  AND ( SO.SO_STATUS='N' OR SO.SO_STATUS IS NULL) AND ( SD.SO_STATUS='N' OR SD.SO_STATUS IS NULL)
    AND INA.LOT_NO=SD.LOT_NO(+) AND INA.PK_KIND='0' AND  SD.LOT_NO=ML.LOT_NO(+) AND SD.SO_NO=ML.SO_NO(+)
    AND OUTA.SO_REC = ML.SO_NO AND ( ML.STATUS<>'2'   OR ML.STATUS IS NULL)
    AND OUTA.OLD_LOT_NO = INA.LOT_NO AND OUTA.PK_KIND='2'
    AND ( SO.SO_FLAG<>'4' OR SO.SO_FLAG IS NULL)
    AND ina.site = ${site}
    and (${lot_no} is null or ina.lot_no = ${lot_no})
    and (${so_no} is null or sd.so_no = ${so_no})
    and (${date_from} is null or trunc( INA.DOC_DATE) >= to_date(${date_from},'yyyy/mm/dd'))
    and (${date_to} is null or trunc( INA.DOC_DATE) <= to_date(${date_to},'yyyy/mm/dd')) `;

    sql =
      sql +
      `union
    SELECT DISTINCT SO.SO_NO,INA.LOT_NO,MHUB_GET_INV_INFO(INA.LOT_NO,'BU') BU,NVL(SO.VENDOR_NAME,INA.VENDOR_NAME) VENDOR_NAME,
    SO.SHIP_VIA SHIP_TYPE,TO_CHAR(INA.MHK_ETD,'yyyy/mm/dd') ATD_HK,NVL(SO.PACKAGE_NO,INA.TOTAL_CARTON) TOTAL_CARTON,
    NVL(SO.TOTAL_PALLET,INA.TOTAL_PALLET) TOTAL_PALLET,SO.WEIGHT,'N/A' CBM,ML.MEASURE CKS_CBM,
    MHUB_GET_BUYER(INA.LOT_NO) BUYER,INA.DELIVERY_TERM,NVL(SO.DELIV_PLA,INA.SHIP_FROM) SHIP_FROM,
    NVL(SO.CONNECT_FWD,INA.SHIPPING_MARK2) FORWARDER,NVL(INA.ORIGIN_SHIP_VIA,INA.SHIP_VIA) VENDOR_SHIP_TYPE,
    INA.TRANS_NO FLT_NO,SO.MAWB,SO.HAWB,SO.SERVICE_REQUIRED COLLECT,
    NULL BL_NO,NULL CONTAINER_NO, NULL ATTENDANT,NULL SECOND_FWD ,NULL SECOND_FWD_ETA,null OUT_LOT_NO
    FROM MHUB_SO_DTL SD,MHUB_SO_MST SO ,MHUB_ASN_MST INA,MHUB_LABEL ML
    WHERE SD.SO_NO=SO.SO_NO(+)  AND ( SO.SO_STATUS='N' OR SO.SO_STATUS IS NULL) AND ( SD.SO_STATUS='N' OR SD.SO_STATUS IS NULL)
    AND INA.LOT_NO=SD.LOT_NO(+) AND INA.PK_KIND='0' AND  SD.LOT_NO=ML.LOT_NO(+) AND SD.SO_NO=ML.SO_NO(+) AND ( ML.STATUS<>'2'   OR ML.STATUS IS NULL)
    AND ( SO.SO_FLAG<>'4' OR SO.SO_FLAG IS NULL) AND  ( INA.LOT_CODE='HD' OR  ML.SO_NO LIKE 'B%' OR ML.SO_NO LIKE 'H%'  OR ML.SO_NO IS NULL)
    AND ina.site = ${site}
    and (${lot_no} is null or ina.lot_no = ${lot_no})
    and (${so_no} is null or sd.so_no = ${so_no})
    and (${date_from} is null or trunc( INA.DOC_DATE) >= to_date(${date_from},'yyyy/mm/dd'))
    and (${date_to} is null or trunc( INA.DOC_DATE) <= to_date(${date_to},'yyyy/mm/dd')) `;

    sql = sql + `) ORDER BY ATD_HK DESC `;
    // tslint:disable-next-line:no-console
    // console.log(sql);
    return this.db.execute(sql);
  }

  async GetImportReport(lot_no: string, mhk_etd: string, ship_via: string, site: string) {
    lot_no = toStoreString(lot_no);
    ship_via = toStoreString(ship_via);
    site = toStoreString(site);
    const date_arr = mhk_etd.split(',');
    const date_from = toStoreString(date_arr[0]);
    const date_to = toStoreString(date_arr[1]);

    const sql = `
    SELECT SO_NO,IN_LOT_NO,MC_NAME,PART_DESC,TOTAL_PACKAGE,TOTAL_G_WEIGHT,QTY,
    AMOUNT,SPE_INFO,MHK_ETD,SHIP_VIA,PK_STATUS,LOT_NO,SHIP_REMARK,40 + TOTAL_G_WEIGHT*14 FREIGHT FROM (
      SELECT AM.SO_REC SO_NO,AM.OLD_LOT_NO IN_LOT_NO,MHUB_GET_SHIPPINT_MC(AM.OLD_LOT_NO,'MC') MC_NAME,
      MHUB_UTILITY_PKG.GET_DESC_PIRCE_COUNTRY_BY_LOT(AM.LOT_NO) PART_DESC ,
      ( CASE WHEN AM.TOTAL_PALLET = 0 THEN AM.TOTAL_CARTON ||'箱' ELSE AM.TOTAL_CARTON ||'箱('|| AM.TOTAL_PALLET|| '棧板)' END ) TOTAL_PACKAGE,
      ( SELECT SUM(TOTAL_C_G_WEIGHT) FROM MHUB_PACKLIST  WHERE LOT_NO= AM.LOT_NO) TOTAL_G_WEIGHT,
      SUM(IL.RECEIVED_QTY) QTY,SUM(IL.AMOUNT) AMOUNT,SO.SPE_INFO,
      AM.MHK_ETD,SO.SHIP_VIA ,AM.PK_STATUS,AM.LOT_NO,MHUB_GET_SHIPPINT_MC(AM.OLD_LOT_NO,'') SHIP_REMARK
      FROM MHUB_ASN_MST AM ,MHUB_INVOICE_LIST IL,MHUB_SO_MST SO,MHUB_SO_DTL SD
      WHERE  AM.PK_STATUS IN ('2','9','C') AND AM.PK_KIND='2'
      AND AM.LOT_NO = IL.LOT_NO  AND AM.SO_REC = SD.SO_NO AND SD.SO_STATUS='N' AND SO.SO_NO = SD.SO_NO AND SO.SO_STATUS='N'
      AND AM.site = ${site}
      AND (${lot_no} is null or AM.OLD_LOT_NO= ${lot_no})
      AND (${ship_via} is null or SO.SHIP_VIA= ${ship_via})
      AND (${date_from} is null or  AM.MHK_ETD >= to_date(${date_from},'yyyy/mm/dd'))
      AND (${date_to} is null or  AM.MHK_ETD <= to_date(${date_to},'yyyy/mm/dd'))
      GROUP BY AM.SO_REC ,AM.OLD_LOT_NO,AM.MHK_ETD,AM.MC_CODE,SO.SHIP_VIA ,AM.PK_STATUS,AM.TOTAL_PALLET,AM.TOTAL_CARTON,AM.LOT_NO,SO.SPE_INFO )
      ORDER BY MHK_ETD  `;

    return this.db.execute(sql);

    /*     const sql = ` SELECT AM.SO_REC SO_NO,AM.OLD_LOT_NO IN_LOT_NO,NVL(AM.MC_CODE,'NA') MC_NAME,
   TO_CHAR(WM_CONCAT(IL.PART_DESC)) PART_DESC ,
   ( CASE WHEN AM.TOTAL_PALLET = 0 THEN AM.TOTAL_CARTON ||'箱' ELSE AM.TOTAL_CARTON ||'箱('|| AM.TOTAL_PALLET|| '棧板)' END ) TOTAL_PACKAGE,
   SUM(PK.TOTAL_C_G_WEIGHT) TOTAL_G_WEIGHT,SUM(IL.RECEIVED_QTY) QTY,
   TO_CHAR(WM_CONCAT(IL.UNIT_PRICE)) UNIT_PRICE,SUM(IL.AMOUNT) AMOUNT,
   TO_CHAR(WM_CONCAT(IL.ORIGIN_COUNTRY)) ORIGIN_COUNTRY ,SM.SPE_INFO,
   AM.MHK_ETA,AM.SHIP_VIA ,AM.PK_STATUS,AM.LOT_NO
    FROM MHUB_ASN_MST AM ,MHUB_INVOICE_LIST IL,MHUB_PACKLIST PK,MHUB_SO_MST SM
    WHERE  AM.PK_STATUS IN ('2','9','C') AND AM.PK_KIND='2'
    AND AM.LOT_NO = IL.LOT_NO AND AM.LOT_NO=PK.LOT_NO AND AM.SO_REC = SM.SO_NO
    AND (${lot_no} is null or AM.OLD_LOT_NO= ${lot_no})
    AND (${ship_via} is null or AM.SHIP_VIA= ${ship_via})
    AND (${date_from} is null or  AM.MHK_ETA >= to_date(${date_from},'yyyy/mm/dd'))
    AND (${date_to} is null or  AM.MHK_ETA <= to_date(${date_to},'yyyy/mm/dd'))
    GROUP BY AM.SO_REC ,AM.OLD_LOT_NO,AM.MHK_ETA,AM.MC_CODE,AM.SHIP_VIA ,AM.PK_STATUS,AM.TOTAL_PALLET,AM.TOTAL_CARTON,AM.LOT_NO,SM.SPE_INFO `; */
  }

  async GetCloseUnproductiveMaterial(out_lot_no: string, in_lot_no: string) {
    if (in_lot_no) {
      const insql = ` select * from MHUB_ASN_MST where OLD_LOT_NO = '${in_lot_no}' and PK_KIND='2' `;
      const res = await this.db.execute(insql);
      out_lot_no = res.rows[0].LOT_NO;
    }
    const sql = ` select * from table(mhub_get_lot_pn_info('${out_lot_no}')) `;
    return this.db.execute(sql);
  }
}
