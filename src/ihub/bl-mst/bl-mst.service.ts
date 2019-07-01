import { CommonService } from '../shared/common.service';
import { BlMstEntity, BlMstInterface, BlMstObject } from './bl-mst.dto';
import { Injectable } from '@nestjs/common';
import { Database } from '../../class/database.class';
import * as oracledb from 'oracledb';
import { UtilService } from '../../core/util.service';
import { sortUtils } from '../../shared/utils';

@Injectable()
export class BlMstService {
  db: Database;
  constructor(private commonService: CommonService, private util: UtilService) {
    this.db = new Database(BlMstObject, BlMstEntity);
  }

  getFinishCombine(onBoardDate: string, containerNo: string) {
    return this.db.execute(`SELECT CONTAINER_NO,
      TO_CHAR(ONBOARD_DATE,'YYYY-MM-DD') ONBOARD_DATE,
      SUM (TOTAL_PALLET) AS TOTAL_PALLET,
      SUM (TOTAL_CARTON) AS TOTAL_CARTON,
      SUM (TOTAL_BULK_CARTON) AS TOTAL_BULK_CARTON,
      SUM (TOTAL_PACKAGE) AS TOTAL_PACKAGE,
      SUM (TOTAL_WEIGHT) AS TOTAL_WEIGHT,
      SUM (TOTAL_MEASUREMENT) AS TOTAL_MEASUREMENT
  FROM MHUB_COMBINE_SO_MST A
  WHERE PROCESS_FLAG = '3'
      AND A.CONTAINER_NO = NVL ('${containerNo}', A.CONTAINER_NO)
      AND A.ONBOARD_DATE =
            NVL (TO_DATE ('${onBoardDate}', 'YYYY-MM-DD'), A.ONBOARD_DATE)
  GROUP BY CUSTOMER_CODE, CONTAINER_NO, ONBOARD_DATE
  ORDER BY ONBOARD_DATE DESC`);
  }

  getWaitBlList(onBoardDate: string, containerNo: string) {
    return this.db.execute(`  SELECT MC.COMBINE_SO_NO,
    MC.TOTAL_PALLET,
    MC.TOTAL_CARTON,
    MC.TOTAL_BULK_CARTON,
    MC.TOTAL_PACKAGE,
    MC.TOTAL_WEIGHT,
    MC.TOTAL_MEASUREMENT,
    ML.LOOKUP_LABEL CONSIGNEE,
    MHUB_BL_PKG.GET_INF_BYTYPE (MC.COMBINE_SO_NO, 'SHIPPER') SHIPPER,
    MHUB_BL_PKG.GET_INF_BYTYPE (MC.COMBINE_SO_NO, 'SO') SO,
    MHUB_BL_PKG.GET_INF_BYTYPE (MC.COMBINE_SO_NO, 'LOT') LOT
FROM MHUB_COMBINE_SO_MST MC, MIL_LOOKUP_VALUES_ALL ML
WHERE     MC.CHINA_COMPANY_CODE = ML.LOOKUP_CODE
    AND MC.ONBOARD_DATE = TO_DATE ('${onBoardDate}', 'YYYY-MM-DD')
    AND MC.CONTAINER_NO = '${containerNo}'
    AND ML.LOOKUP_TYPE = 'BL_MAINTAIN_CONSIGNEE'
    AND COMBINE_SO_NO NOT IN (SELECT NOTIFY_PHONE
                                FROM MHUB_BL_MST
                               WHERE NOTIFY_PHONE IS NOT NULL)
ORDER BY COMBINE_SO_NO ASC`);
  }

  getWaitConfirmList(dateFrom: string, dateTo: string) {
    let sql = `SELECT HAWB,
    TO_CHAR(ONBOARD_DATE,'YYYY-MM-DD') ONBOARD_DATE,
           LOT_NO,
           SHIPPER,
           SO_NO,
           SHIP_VIA,
           NOTIFY_PHONE
      FROM MHUB_BL_MST
      WHERE     BL_STATUS = 'N'
        AND CUSTOMER_CODE = '00003'`;

    if (!this.util.isNull(dateFrom)) {
      sql = sql + ` AND ONBOARD_DATE >= TO_DATE ('${dateFrom}', 'YYYY-MM-DD')`;
    }

    if (!this.util.isNull(dateTo)) {
      sql = sql + ` AND ONBOARD_DATE <= TO_DATE ('${dateTo}', 'YYYY-MM-DD')`;
    }

    sql = sql + ` order by ONBOARD_DATE DESC,NOTIFY_PHONE`;
    return this.db.execute(sql);
  }

  getBlList(onBoardDate: string, containerNo: string) {
    return this.db.execute(`SELECT NOTIFY_PHONE,
    TRANSPORT_NO,
    TO_CHAR(ONBOARD_DATE,'YYYY-MM-DD') ONBOARD_DATE,
    FLIGHT_NO,
    DEPARTURE_CODE,
    ARRIVAL_CODE,
    CONTAINER_NO,
    SEAL_NO,
    CONTAINER_SIZE,
    MAWB,
    TOTAL_PALLET,
    TOTAL_CARTON,
    BULK_CARTON
    FROM MHUB_BL_MST
    WHERE ONBOARD_DATE = TO_DATE ('${onBoardDate}', 'YYYY-MM-DD')
    AND  CONTAINER_NO = '${containerNo}'
    ORDER BY NOTIFY_PHONE`);
  }

  async getAllMst() {
    return await this.db.execute(`select * from ${BlMstObject.tableName}`);
  }

  async createMst(body: BlMstInterface, userId: number) {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN
        MHUB_BL_PKG.CREATE_BL(
          :1,
          :2,
          :3,
          TO_DATE(:4,'YYYY-MM-DD'),
          :5,
          :6,
          :7,
          :8,
          :9,
          :10,
          :11,
          :errMessage
      );
      END;`,
        {
          1: body.CSNOLIST,
          2: body.BLNOLIST,
          3: body.TRANSPORT_NO,
          4: body.ONBOARD_DATE,
          5: body.FLIGHT_NO,
          6: body.DEPARTURE_CODE,
          7: body.ARRIVAL_CODE,
          8: body.FWD_NAME,
          9: body.CONTAINER_NO,
          10: body.SEAL_NO,
          11: body.CONTAINER_SIZE,
          errMessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    return result.outBinds ? result.outBinds : { status: 9 };
  }

  async deleteBl(blNo: string) {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN
        MHUB_BL_PKG.DELETE_BL(
          :1,
          :status
      );
      END;`,
        {
          1: blNo,
          status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    return result.outBinds ? result.outBinds : { status: 9 };
  }

  async comfirmBl(hawb: string, userId: number) {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN
        MHUB_BL_PKG.BL_CONFIRM(
          :1,
          :errMessage
      );
      END;`,
        {
          1: hawb,
          errMessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    return result.outBinds ? result.outBinds : { status: 9 };
  }

  async getBlInqRep(query) {
    const {
      customerCode,
      buyCom,
      selCom,
      soNo,
      blNo,
      oldLotNo,
      containerNo,
      shipVia,
      dateFrom,
      dateTo,
    } = query;
    const _buyCom = buyCom || '';
    const _selCom = selCom || '';
    const _soNo = soNo || '';
    const _blNo = blNo || '';
    const _oldLotNo = oldLotNo || '';
    const _containerNo = containerNo || '';
    const _dateFrom = dateFrom || '';
    const _dateTo = dateTo || '';

    let sql = `  SELECT TO_CHAR(ONBOARD_DATE,'YYYY-MM-DD') ONBOARD_DATE,
       FLIGHT_NO,
       CONTAINER_NO,
       MB.MAWB,
       LOT_NO,
       MHUB_UTILITY_PKG.GET_BL_OUT_LOT_NO (LOT_NO,MB.MAWB) OUT_LOT_NO,
       TOTAL_PALLET,
       TOTAL_CARTON,
       BULK_CARTON,
       BULK_CARTON + TOTAL_CARTON TOT_CAR,
       TOTAL_N_WEIGHT,
       TOTAL_WEIGHT,
       CONTAINER_SIZE,
       MHUB_UTILITY_PKG.GET_BL_QUANTITY_BY_LOT (LOT_NO) QUANTITY,
       MHUB_UTILITY_PKG.GET_BL_AMOUNT_BY_LOT (LOT_NO,MB.MAWB) AMOUNT,
       MHUB_UTILITY_PKG.GET_EPTG_DESC_BY_LOT(LOT_NO)  EPTG_DESC,
       MHUB_UTILITY_PKG.GET_ORIGIN_COUNTRY_BY_LOT (LOT_NO) ORIGIN_COUNTRY,
       MHUB_UTILITY_PKG.GET_PALLET_TYPE_BY_LOT (LOT_NO) PALLET_TYPE,
       MHUB_UTILITY_PKG.GET_URGENT_BY_LOT (LOT_NO) URGENT,
       (SELECT ATTRIBUTE2
          FROM MHUB_COMBINE_SO_MST
         WHERE COMBINE_SO_NO = NOTIFY_PHONE)
          SPLIT_FLAG,
       DECODE(ME.PROCESS_FLAG,'1','待ERP接收資料','2','ERP已獲取資料','3','ERP處理失敗','4','ERP處理成功','') PROCESS_FLAG,
       ME.REQUEST_NO,
       ME.ERR_MESSAGE
  FROM MHUB_bl_mst MB, MHUB_ERP_CUSTOM_EDI_DATA ME
 WHERE   MB.MAWB = ME.MAWB(+)
       AND MB.CUSTOMER_CODE = '${customerCode}'
       AND MB.buyer_company = NVL ('${_buyCom}', MB.buyer_company)
       AND MB.SELLER_COMPANY = NVL ('${_selCom}', MB.SELLER_COMPANY)
       AND MB.MAWB = NVL ('${_blNo}', MB.MAWB)
       AND MB.CONTAINER_NO = NVL ('${_containerNo}', MB.CONTAINER_NO)`;

    if (!this.util.isNull(_oldLotNo)) {
      sql += `AND LOT_NO LIKE '%' || '${_oldLotNo}' || '%'`;
    }

    if (!this.util.isNull(_soNo)) {
      sql += `AND SO_NO LIKE '%' || '${_soNo}' || '%'`;
    }

    if (!this.util.isNull(_dateFrom)) {
      sql += `AND ONBOARD_DATE>=TO_DATE('${_dateFrom}','YYYY-MM-DD')`;
    }

    if (!this.util.isNull(_dateTo)) {
      sql += `AND ONBOARD_DATE<=TO_DATE('${_dateTo}','YYYY-MM-DD')`;
    }

    sql += ` ORDER BY HAWB ASC`;

    return await this.db.execute(sql);
  }

  async bLPdfMail(blNo: string, empno: string) {
    try {
      await this.db.execute(
        `BEGIN
        MHUB_BL_PKG.CREATE_BL_PDF(
          '${blNo}',
          '${empno}'
      );
      END;`,
      );
    } catch (e) {
      throw new Error(e);
    }
    return 'Y';
  }

  async getReportInf(query) {
    try {
      const { blNo, dateFrom, dateTo } = query;
      const _blNo = blNo || '';
      const _dateFrom = dateFrom || '';
      const _dateTo = dateTo || '';
      let sql;
      if (!this.util.isNull(_blNo)) {
        sql = `select a.*,TO_CHAR(ONBOARD_DATE,'YYYYMMDD') ONBOARD_DATE1,TO_CHAR(ONBOARD_DATE,'YYYY/MM/DD') ONBOARD_DATE2
         from ${BlMstObject.tableName} a WHERE MAWB= '${_blNo}' `;
      }

      if (!this.util.isNull(_dateFrom) && !this.util.isNull(_dateTo)) {
        sql = `select a.*,TO_CHAR(ONBOARD_DATE,'YYYYMMDD') ONBOARD_DATE1,TO_CHAR(ONBOARD_DATE,'YYYY/MM/DD') ONBOARD_DATE2
         from ${
           BlMstObject.tableName
         } a WHERE ONBOARD_DATE >= to_date('${_dateFrom}','YYYY-MM-DD')
         and ONBOARD_DATE<=to_date('${_dateTo}','YYYY-MM-DD') `;
      }

      const detail = () =>
        `BEGIN
        MHUB_BL_PKG.GET_BL_REPORT_INF(
            :1,
            :PACKAGE_UOM,
            :DISP,
            :PART_DES,
            :HK_BL_NO,
            :DELIV_PLA,
            :MARK
        );
        END;`;

      return this.db.execute(sql).then(r => {
        const ls: any[] = r.rows;
        const nLs = [];
        const rq = [];
        ls.reduce((a, b) => {
          a.push(
            this.db
              .execute(detail(), {
                1: b.MAWB,
                PACKAGE_UOM: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                DISP: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                PART_DES: {
                  dir: oracledb.BIND_OUT,
                  type: oracledb.STRING,
                  maxSize: 4000,
                },
                HK_BL_NO: {
                  dir: oracledb.BIND_OUT,
                  type: oracledb.STRING,
                  maxSize: 4000,
                },
                DELIV_PLA: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                MARK: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
              })
              .then(r1 => {
                const res = r1.outBinds;
                nLs.push(Object.assign(b, res));
              }),
          );

          return a;
        }, rq);
        return Promise.all(rq).then(() => {
          nLs.sort((a, b) => sortUtils.byCharCode(a.MAWB, b.MAWB, true));
          return nLs;
        });
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async blEdiToErp(hawb: string, userId: number) {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN
        MHUB_OUTBOUND_PK_INV_PKG.BL_EDI_TO_ERP(
          :1,
          :2,
          :errMessage
      );
      END;`,
        {
          1: hawb,
          2: userId,
          errMessage: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        },
      );
    } catch (e) {
      throw new Error(e);
      return { status: 9 };
    }
    return result.outBinds ? result.outBinds : { status: 9 };
  }
}
