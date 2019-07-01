import { Database } from '../../class/database.class';
import { CommonService } from '../shared/common.service';
import {
  MhubLabelEntity,
  MhubLabelObject,
  MhubLabelInterface,
} from './mhub-label.dot';
import { Injectable } from '@nestjs/common';

import { UpdateObject } from '../../class/update-object.class';
import { toStoreString } from '../../shared/tables';
import { UtilService } from '../../core/util.service';

@Injectable()
export class MbuhLabelService {
  db: Database;
  constructor(private commonService: CommonService, private util: UtilService) {
    this.db = new Database(MhubLabelObject, MhubLabelEntity);
  }

  async searchMhubLabel(filter: any, pi = 1, ps = 1000) {
    return await this.db.find(filter, pi, ps);
  }

  async getLabelByLot(lot_no: string, so_no: string) {
    lot_no = lot_no.replace(/,/g, `','`); // g代表替換所有的逗號
    return this.db.execute(
      `SELECT TO_CHAR(WM_CONCAT(VENDOR_SO)) VENDOR_SO,AM.SITE FROM MHUB_LABEL ML,MHUB_ASN_MST AM WHERE  AM.LOT_NO IN ('${lot_no}')
       AND ( ML.SO_NO='${so_no}' OR ML.SO_NO IS NULL) AND ( ML.STATUS<>'2' OR ML.STATUS IS NULL ) AND AM.LOT_NO=ML.LOT_NO(+) GROUP BY AM.SITE`,
    );
  }

  // 當lot新入倉時
  async getNewLabel(lot_no: string) {
    return this.db
      .execute(`SELECT SO.LOT_NO,'00003' CUSTOMER_CODE,SO.SO_NO , SO.VENDOR_SO,SO.MEASURE,SO.WEIGHT,
      NVL(AM.TOTAL_PALLET,0) TOTAL_PALLET,NVL(AM.TOTAL_CARTON,0) TOTAL_CARTON
    FROM MHUB_SO_MST SO,MHUB_ASN_MST AM WHERE  SO.LOT_NO='${lot_no}' AND SO.SO_STATUS='N' AND SO.LOT_NO=AM.LOT_NO `);
  }

  async createMhubLabel(body: MhubLabelInterface, userId: number) {
    try {
      return await this.db.insert(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateMhubLabel(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  // 獲取新的VENDOR_SO
  async getNewVendorSo(pack_type: string) {
    return this.db.execute(
      `SELECT '${pack_type}'|| TO_CHAR(SYSDATE,'YYMMDD') || LPAD(MHUB_LABEL_LOOP_SEQ.NEXTVAL,3,0) VENDOR_SO FROM DUAL `,
    );
  }

  async updateSO(lot_no: string, so_no: string, vendor_so: string) {
    return this.db.execute(
      `UPDATE MHUB_SO_MST SET VENDOR_SO='${vendor_so}' WHERE  LOT_NO='${lot_no}' AND SO_NO='${so_no}' `,
    );

    /* return this.db.execute(
       `UPDATE MHUB_ASN_MST SET PK_STATUS='3' WHERE  LOT_NO='${lot_no}' AND PK_KIND=0 `,
     ); */
  }

  async getExistsInventoryLabel(container_no: string, onBoardDate: string) {
    const date_from = toStoreString(onBoardDate);
    const sql = ` SELECT ML.ID ,TO_CHAR(ML.LAST_UPDATE_DATE,'yyyy/mm/dd  hh24:mi') TURNIN_DATE,ML.VENDOR_SO,
                   ML.LOT_NO,ML.SO_NO,ML.TOTAL_PALLET,ML.TOTAL_CARTON,ML.STATUS,
                   ML.CONTAINER_NO,ML.COMBINE_LOT_TYPE,ML.MEASURE CBM,TO_CHAR(NVL(ML.WEIGHT,0)) WEIGHT ,ML.ATTRIBUTE6 PLT ,
                   ML.VENDOR_NAME2 VENDOR_NAME,ML.FWD_NAME CONNECT_FWD,ML.MAWB,ML.HAWB,'' SHIP_DATE,'' URGENT,
                   ML.SHIP_VIA,ML.REMARK,'N' IS_LOT_EXISTS,substr(SO_NO,0,2) SO_TYPE,MHUB_GET_OUT_LOT(ML.LOT_NO,ML.SO_NO) OUT_LOT_NO
                   FROM MHUB_LABEL ML WHERE ML.CONTAINER_NO = '${container_no}' AND STATUS NOT IN (2,3)
                   AND (${date_from} is null or  ML.ONBOARD_DATE = to_date(${date_from},'yyyy/mm/dd')) `;
    return this.db.execute(sql);
  }

  // 獲取要封柜的label
  async getInventoryLabel(
    dateFrom: string,
    dateTo: string,
    lot_no: string,
    so_no: string,
    vendor_so: string,
    site: string,
  ) {
    let sql = `SELECT * FROM (`;
    sql =
      sql +
      ` SELECT ML.ID ,TO_CHAR(ML.LAST_UPDATE_DATE,'yyyy/mm/dd hh24:mi') TURNIN_DATE,ML.VENDOR_SO,
                ML.LOT_NO,ML.SO_NO,ML.TOTAL_PALLET,ML.TOTAL_CARTON,ML.STATUS,
                ML.CONTAINER_NO,ML.COMBINE_LOT_TYPE,ML.MEASURE CBM,TO_CHAR(NVL(SM.WEIGHT,0)) WEIGHT ,ML.ATTRIBUTE6 PLT ,SM.VENDOR_NAME,
                SM.CONNECT_FWD,SM.MAWB,SM.HAWB,TO_CHAR(SM.SHIP_DATE,'yyyy/mm/dd ') SHIP_DATE,DECODE(IS_URGENT,'Y','急料') URGENT,
                ML.SHIP_VIA,ML.REMARK,'Y' IS_LOT_EXISTS,substr(ML.SO_NO,0,2) SO_TYPE,MHUB_GET_OUT_LOT(ML.LOT_NO,ML.SO_NO) OUT_LOT_NO
                FROM MHUB_LABEL ML,MHUB_SO_MST SM ,MHUB_ASN_MST AM
                WHERE ML.CONTAINER_NO IS NULL AND ML.REMARK IS NULL AND ML.STATUS<>2
                AND ML.SO_NO = SM.SO_NO(+)  AND ( SM.SO_STATUS='N' OR SM.SO_STATUS IS NULL)
                AND ML.LOT_NO = AM.LOT_NO AND AM.PK_KIND='0'
                AND TRUNC(ML.LAST_UPDATE_DATE) BETWEEN TO_DATE( '${dateFrom}','yyyy/mm/dd') AND TO_DATE( '${dateTo}','yyyy/mm/dd')
                AND AM.SITE='${site}' `;
    // AND TO_CHAR(ML.CREATION_DATE,'yyyy/mm/dd') BETWEEN  '${dateFrom}' AND '${dateTo}' ;

    if (lot_no) {
      sql = sql + ` AND ML.LOT_NO='${lot_no}' `;
    }

    if (so_no) {
      sql = sql + ` AND ML.SO_NO='${so_no}' `;
    }

    if (vendor_so) {
      sql = sql + ` AND ML.VENDOR_SO='${vendor_so}' `;
    }

    if (site === 'MSL') {
      let unionSql = `  union SELECT ML.ID ,TO_CHAR(ML.LAST_UPDATE_DATE,'yyyy/mm/dd  hh24:mi') TURNIN_DATE,ML.VENDOR_SO,
                        ML.LOT_NO,ML.SO_NO,ML.TOTAL_PALLET,ML.TOTAL_CARTON,ML.STATUS,
                        ML.CONTAINER_NO,'N/A' COMBINE_LOT_TYPE,0 CBM,TO_CHAR(NVL(ML.WEIGHT,0)) WEIGHT ,ML.ATTRIBUTE6 PLT ,
                        ML.VENDOR_NAME2 VENDOR_NAME,ML.FWD_NAME CONNECT_FWD,ML.MAWB,ML.HAWB,'' SHIP_DATE,'' URGENT,
                        ML.SHIP_VIA,ML.REMARK,'N' IS_LOT_EXISTS,substr(SO_NO,0,2) SO_TYPE,null OUT_LOT_NO
                        FROM MHUB_LABEL ML
                        WHERE ML.CONTAINER_NO IS NULL AND ML.REMARK IS NULL AND ML.STATUS<>2
                        AND NOT EXISTS ( SELECT LOT_NO FROM MHUB_ASN_MST AM WHERE AM.LOT_NO = ML.LOT_NO)
                        AND TRUNC(ML.LAST_UPDATE_DATE) BETWEEN TO_DATE( '${dateFrom}','yyyy/mm/dd') AND TO_DATE( '${dateTo}','yyyy/mm/dd') `;

      if (lot_no) {
        unionSql = unionSql + ` AND ML.LOT_NO='${lot_no}' `;
      }

      if (so_no) {
        unionSql = unionSql + ` AND ML.SO_NO='${so_no}' `;
      }

      if (vendor_so) {
        unionSql = unionSql + ` AND ML.VENDOR_SO='${vendor_so}' `;
      }

      sql = sql + unionSql;
    }

    sql = sql + ` ) ORDER BY ID `;
    // tslint:disable-next-line:no-console
    // console.log(sql);
    return this.db.execute(sql);
  }

  // 獲取裝櫃完成的Label
  getFinishLabel(onBoardDate: string) {
    return this.db
      .execute(`   SELECT TO_CHAR(V.ONBOARD_DATE,'yyyy/mm/dd') ONBOARD_DATE ,V.SHIP_VIA,V.CONTAINER_NO,V.RECORD_COUNT, V.TOTAL_CTNS,
    MHUB_GET_CTNS_IN_PALLET(V.ONBOARD_DATE,V.CONTAINER_NO) CTNS ,
    MHUB_GET_CTNS_IN_BULK(V.ONBOARD_DATE,V.CONTAINER_NO) BCTNS,MHUB_GET_FINISH_STATUS(V.ONBOARD_DATE,V.CONTAINER_NO) STATUS FROM (
        SELECT ONBOARD_DATE ,SHIP_VIA,CONTAINER_NO,COUNT(*) RECORD_COUNT, SUM(TOTAL_CARTON) TOTAL_CTNS
        FROM MHUB_LABEL WHERE TRUNC(ONBOARD_DATE)=TO_DATE('${onBoardDate}','yyyy-mm-dd')
       GROUP BY ONBOARD_DATE,SHIP_VIA,CONTAINER_NO ORDER BY SHIP_VIA ASC) V `);
  }

  // 獲取裝櫃完成的Label明細
  getFinishLabelDetail(onBoardDate: string, containerNO: string) {
    return this.db
      .execute(`  SELECT CONTAINER_NO,VENDOR_SO,TO_CHAR(LAST_UPDATE_DATE,'yyyy/mm/dd') TURNIN_DATE,TO_CHAR(ONBOARD_DATE,'yyyy/mm/dd') ONBOARD_DATE,
        LOT_NO,SO_NO,TOTAL_PALLET,TOTAL_CARTON,MEASURE,REMARK,DECODE(STATUS,3,'FINISH','NOT FINISH') STATUS
         FROM MHUB_LABEL  WHERE ONBOARD_DATE=TO_DATE('${onBoardDate}','yyyy/mm/dd') AND CONTAINER_NO='${containerNO}' ORDER BY ID `);
  }

  // 裝櫃完成后的Finish動作
  async updateLabelFinish(onBoardDate: string, containerNO: string) {
    return this.db.execute(
      `UPDATE MHUB_LABEL SET STATUS=3 WHERE ONBOARD_DATE=TO_DATE('${onBoardDate}','yyyy/mm/dd') AND CONTAINER_NO='${containerNO}' `,
    );
  }

  async getMhubLabelByVendorSo(vendor_so: string) {
    return this.db
      .execute(`SELECT ML.ID,LOT_NO,CUSTOMER_CODE,SO_NO,VENDOR_SO,MEASURE,WEIGHT,TOTAL_PALLET,
      TOTAL_CARTON,LAST_UPDATE_DATE TURNIN_DATE,PALLET_TYPE,FWD_NAME,DECODE(ML.STATUS,2,'已Cancel',3,'已裝櫃','待裝櫃') STATUS
      FROM MHUB_LABEL ML WHERE  vendor_so='${vendor_so}'  `);
  }

  async getAllLabelIncludeNew(hawb: string, lot_no: string) {
    hawb = toStoreString(hawb);
    lot_no = toStoreString(lot_no);
    const sql = `       SELECT null ID,AM.LOT_NO,'00003' CUSTOMER_CODE,SO.SO_NO ,null VENDOR_SO,SO.MEASURE,
      AM.TOTAL_GROSS_WEIGHT WEIGHT,AM.TOTAL_PALLET ,AM.IS_URGENT,
      AM.TOTAL_CARTON,null TURNIN_DATE,null PALLET_TYPE,null FWD_NAME,'待裝櫃' STATUS
      FROM MHUB_SO_MST SO,MHUB_ASN_MST AM ,MHUB_SO_DTL ST
      WHERE   AM.LOT_NO=ST.LOT_NO(+) AND ST.SO_NO=SO.SO_NO(+) AND ( SO.SO_STATUS='N' OR SO.SO_STATUS IS NULL) AND AM.PK_KIND=0
      AND ( ST.SO_STATUS='N' OR ST.SO_STATUS IS NULL)
      AND (${hawb} IS null OR AM.HAWB = ${hawb})
      AND (${lot_no} IS null OR AM.LOT_NO = ${lot_no})
      AND NOT EXISTS (SELECT * FROM  MHUB_LABEL ML WHERE ML.LOT_NO=AM.LOT_NO AND ML.SO_NO = ST.SO_NO AND ML.STATUS <>'2')
      UNION
      SELECT ML.ID,ML.LOT_NO,ML.CUSTOMER_CODE,ML.SO_NO,ML.VENDOR_SO,ML.MEASURE,ML.WEIGHT,ML.TOTAL_PALLET,AM.IS_URGENT,
      ML.TOTAL_CARTON,ML.LAST_UPDATE_DATE TURNIN_DATE,ML.PALLET_TYPE ,ML.FWD_NAME,DECODE(ML.STATUS,2,'已Cancel',3,'已裝櫃','待裝櫃') STATUS
      FROM MHUB_LABEL ML,MHUB_ASN_MST AM,MHUB_SO_DTL ST
      WHERE  AM.LOT_NO=ML.LOT_NO AND ML.SO_NO = ST.SO_NO AND AM.LOT_NO = ST.LOT_NO AND  ML.STATUS <>'2'
      AND (${hawb} IS null OR AM.HAWB = ${hawb})
      AND (${lot_no} IS null OR AM.LOT_NO = ${lot_no})
      UNION
      SELECT ML.ID,LOT_NO,CUSTOMER_CODE,SO_NO,VENDOR_SO,MEASURE,WEIGHT,TOTAL_PALLET,null IS_URGENT,
      TOTAL_CARTON,LAST_UPDATE_DATE TURNIN_DATE,PALLET_TYPE,FWD_NAME,DECODE(ML.STATUS,2,'已Cancel',3,'已裝櫃','待裝櫃') STATUS FROM MHUB_LABEL ML
      WHERE  ML.LOT_NO = ${lot_no} AND NOT EXISTS ( SELECT * FROM MHUB_ASN_MST WHERE LOT_NO = ML.LOT_NO ) AND  ML.STATUS <>'2' `;

    return this.db.execute(sql);
  }

  async getExpressMhubLabel(hawb: string, lot_no: string) {
    hawb = toStoreString(hawb); // 自動加''
    lot_no = toStoreString(lot_no);
    const sql = ` select * from  mhub_label where lot_no=${lot_no} `;
    const res = await this.db.execute(sql);

    if (res.rows.length > 0) {
      return res;
    } else {
      const sqlHawb = ` select * from  mhub_label where lot_no=${hawb} `;
      const resHawb = await this.db.execute(sqlHawb);

      if (resHawb.rows.length > 0) {
        return resHawb;
      } else {
        return [];
      }
    }
  }

  async updateExpressSo(lot_no: string, so_no: string, vendor_so: string) {
    this.db.execute(
      `UPDATE MHUB_SO_MST SET VENDOR_SO='${vendor_so}' WHERE  LOT_NO='${lot_no}' AND SO_NO='${so_no}' `,
    );

    return this.db.execute(
      `update mhub_label set so_no= '${so_no}',lot_no = '${lot_no}' where VENDOR_SO= '${vendor_so}' `,
    );
  }

  async houConfirm(
    lot_no: string,
    hawb: string,
    container_no: string,
    sec_fwd: string,
    sec_eta: string,
    so_no: string,
  ) {
    let result: any;
    try {
      const sql = `BEGIN  mhub_hou_confirm_pkg.main('${lot_no}','${hawb}','${container_no}','${sec_fwd}','${sec_eta}','${so_no}'); END;`;
      result = await this.db.execute(sql);
      // tslint:disable-next-line:no-console
      // console.log(sql);
    } catch (e) {
      throw new Error(e);
    }
    return 'OK';
  }
}
