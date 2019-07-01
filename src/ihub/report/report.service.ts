import { CommonService } from './../shared/common.service';
import { Database } from './../../class/database.class';
import { Injectable } from '@nestjs/common';
import { UtilService } from '../../core/util.service';
import { toStoreDate } from '../../shared/tables';
import { sortUtils } from '../../shared/utils';
import * as oracledb from 'oracledb';

@Injectable()
export class ReportService {
  db: Database;
  conn;
  constructor(private commonService: CommonService, private util: UtilService) {
    this.db = new Database();
  }

  async getIncoming(query) {
    const { BuyCom, InLotNo, outLotNo, mhk_eta, uploadDate } = query;
    const _mhk_eta = mhk_eta || '';
    const _mhk_eta_arr = _mhk_eta.split(',');
    const _mhk_eta_f = toStoreDate(_mhk_eta_arr[0], 'yyyymmdd', 'YYYYMMDD');
    const _mhk_eta_t = toStoreDate(_mhk_eta_arr[1], 'yyyymmdd', 'YYYYMMDD');
    const _uploadDate = uploadDate || '';
    const _uploadDate_arr = _uploadDate.split(',');
    const _uploadDate_f = toStoreDate(
      _uploadDate_arr[0],
      'yyyymmdd',
      'YYYYMMDD',
    );
    const _uploadDate_t = toStoreDate(
      _uploadDate_arr[1],
      'yyyymmdd',
      'YYYYMMDD',
    );
    return await this.db.execute(
      `SELECT A.VENDOR_NAME,
      C.ATTRIBUTE2,
      C.AREA,
      B.PK_NO,
      A.OLD_LOT_NO AS LOT_NO,
      A.LOT_NO AS OUT_LOT_NO,
      C.UPLOAD_DATE AS RECEIVED_DATE2,
      TO_CHAR (C.UPLOAD_DATE, 'yyyy/mm/dd hh24:mi:ss')  UPLOAD_DATE,
      C.RECEIVED_DATE AS RECEIVED_DATE3,
      TO_CHAR (C.RECEIVED_DATE, 'yyyy/mm/dd hh24:mi:ss') AS RECEIVED_DATE
 FROM MHUB_ASN_MST_OUT B, MHUB_RECEIVED_WH_DATE C, MHUB_ASN_MST A
WHERE     A.LOT_NO = B.CONTACT_CODE
      AND A.LOT_NO = C.OUT_LOT_NO
      AND A.CUSTOMER_CODE = '00003'
      AND A.PK_KIND = '2'
      AND A.BUYER_COMPANY='${BuyCom}'
      AND A.OLD_LOT_NO = NVL('${InLotNo}',A.OLD_LOT_NO)
      AND A.LOT_NO = NVL('${outLotNo}',A.LOT_NO)
      AND (${_mhk_eta_f} IS NULL OR A.MHK_ETA >= ${_mhk_eta_f})
      AND (${_mhk_eta_t} IS NULL OR A.MHK_ETA <= ${_mhk_eta_t})
      AND (${_uploadDate_f} IS NULL OR C.UPLOAD_DATE >= ${_uploadDate_f})
      AND (${_uploadDate_t} IS NULL OR C.UPLOAD_DATE <= ${_uploadDate_t})`,
    );
  }

  async getHubInvInfo(query) {
    const { dateFrom, dateTo, status, soNo, lotNo, hubFlag } = query;

    let sql = `SELECT V.CREATED_DATE,
    V.SO_NO,
    V.VENDOR_SO,
    V.LOT_NO,
    V.MITAC_PN,
    V.PROD_ID,
    V.MM_NO,
    SUM (V.CTN) AS CTN,
    SUM (V.TOTAL_QTY) AS QTY,
    V.PART_DESC
FROM (SELECT TO_CHAR (A.CREATION_DATE, 'yyyy/mm/dd hh24:mi:ss')
               AS CREATED_DATE,
            A.SO_NO,
            A.VENDOR_SO,
            A.LOT_NO,
            D.PART_NO AS MITAC_PN,
            MHUB_UTILITY_PKG.GET_INTEL_PART_NO (D.PART_NO) AS PROD_ID,
            NVL (MHUB_UTILITY_PKG.GET_MM_NO (D.PART_DESC), D.PART_DESC)
               AS MM_NO,
            D.TOTAL_CARTON AS CTN,
            D.TOTAL_QTY,
            D.PART_DESC
       FROM MHUB_LABEL A, MHUB_ASN_MST B, MHUB_ASN_DTL D
      WHERE A.LOT_NO = B.LOT_NO(+) AND B.LOT_NO = D.LOT_NO(+)
            AND (D.OUT_SHIP_VIA like '%HOLD%' or D.OUT_SHIP_VIA IS NULL)
            AND D.PART_NO NOT IN
                   (SELECT V.PART_NO
                      FROM MHUB_ASN_DTL V, MHUB_ASN_MST M
                     WHERE     M.LOT_NO = V.LOT_NO
                           AND M.OLD_LOT_NO = A.LOT_NO
                           AND M.PK_STATUS IN ('C', '9'))`;

    if (status === 'O') {
      sql += `AND A.STATUS IN ('0', '1') AND A.ONBOARD_DATE IS NULL
         AND NOT EXISTS (SELECT *  FROM MHUB_ASN_MST C  WHERE C.LOT_NO = A.LOT_NO  AND C.PK_STATUS IN ('7', '8', '9', 'C'))`;
    } else {
      sql += ` AND (TRUNC(A.ONBOARD_DATE)-TRUNC(A.CREATION_DATE)>=0)`;
    }

    if (!this.util.isNull(soNo)) {
      sql += `AND A.SO_NO='${soNo}'`;
    }

    if (!this.util.isNull(lotNo)) {
      sql += `AND A.LOT_NO='${lotNo}'`;
    }

    if (!this.util.isNull(dateFrom)) {
      sql += `AND TRUNC(A.CREATION_DATE)>=TO_DATE('${dateFrom}','YYYY-MM-DD')`;
    }

    if (!this.util.isNull(dateTo)) {
      sql += `AND TRUNC(A.CREATION_DATE)<=TO_DATE('${dateTo}','YYYY-MM-DD')`;
    }

    if (this.util.isNull(dateFrom) && this.util.isNull(dateTo)) {
      sql += ` AND TRUNC(A.CREATION_DATE)>=TRUNC(SYSDATE-7)`;
    }

    if (hubFlag === 'Y' && this.util.isNull(soNo)) {
      sql += ` AND A.SO_NO LIKE 'B%'`;
    }

    sql += `AND A.VENDOR_SO LIKE 'C%') V
    GROUP BY V.CREATED_DATE,
        V.LOT_NO,
        V.SO_NO,
        V.VENDOR_SO,
        V.MITAC_PN,
        V.PROD_ID,
        V.MM_NO,
        V.PART_DESC
    ORDER BY V.VENDOR_SO`;

    return await this.db.execute(sql);
  }

  async getHubInvRep(query) {
    const { dateFrom, dateTo, status, soNo, lotNo, hubFlag } = query;
    // tslint:disable-next-line:no-console
    console.log(`getHubInvRep start at:${new Date()}`);

    let sql = `SELECT A.VENDOR_SO,
                TO_CHAR(A.CREATION_DATE,'yyyy/mm/dd hh24:mi:ss') CREATION_DATE,
                TO_CHAR(A.ONBOARD_TIME,'yyyy/mm/dd hh24:mi:ss') ONBOARD_TIME,
                A.SO_NO,
                B.LOT_NO,
                NVL (B.VENDOR_NAME, A.VENDOR_NAME2) VENDOR_NAME,
                NVL (B.FWD_NAME, A.FWD_NAME) FWD_NAME,
                NVL (B.TRANS_NO, A.FLT_NO) FLT_NO,
                NVL (B.MAWB, A.MAWB) MAWB,
                NVL (B.HAWB, A.HAWB) HAWB,
                A.TOTAL_PALLET,
                A.TOTAL_CARTON,
                A.MEASURE,
                B.CURRENCY,
                (TRUNC (NVL (ONBOARD_TIME, SYSDATE)) - TRUNC (A.CREATION_DATE))
                  AS TOTAL_DAY,
                (SELECT TO_CHAR (WM_CONCAT (DISTINCT INV_NO))
                  FROM MHUB_INV_MST
                  WHERE LOT_NO = B.LOT_NO)
                  INV_NO,
                A.LOT_NO,
                B.LOT_NO LOT_NO2,
                0  WAREHOUSE_CHARGE
            FROM MHUB_LABEL A, MHUB_ASN_MST B
            WHERE A.LOT_NO = B.LOT_NO(+)`;

    if (status === 'O') {
      sql += `AND A.STATUS IN ('0', '1') AND A.ONBOARD_DATE IS NULL
         AND NOT EXISTS (SELECT *  FROM MHUB_ASN_MST C  WHERE C.LOT_NO = A.LOT_NO  AND C.PK_STATUS IN ('7', '8', '9', 'C'))`;
    } else {
      sql += ` AND (TRUNC(A.ONBOARD_DATE)-TRUNC(A.CREATION_DATE)>=0)`;
    }

    if (!this.util.isNull(soNo)) {
      sql += `AND A.SO_NO='${soNo}'`;
    }

    if (!this.util.isNull(lotNo)) {
      sql += `AND A.LOT_NO='${lotNo}'`;
    }

    if (!this.util.isNull(dateFrom)) {
      sql += `AND TRUNC(A.CREATION_DATE)>=TO_DATE('${dateFrom}','YYYY-MM-DD')`;
    }

    if (!this.util.isNull(dateTo)) {
      sql += `AND TRUNC(A.CREATION_DATE)<=TO_DATE('${dateTo}','YYYY-MM-DD')`;
    }

    if (this.util.isNull(dateFrom) && this.util.isNull(dateTo)) {
      sql += ` AND TRUNC(A.CREATION_DATE)>=TRUNC(SYSDATE-7)`;
    }

    if (hubFlag === 'Y' && this.util.isNull(soNo)) {
      sql += ` AND A.SO_NO LIKE 'B%'`;
    }

    sql += ` AND ROWNUM<300`;

    const get_part_detail = (
      lot: string,
    ) => `SELECT TO_CHAR (WM_CONCAT (DISTINCT PO_NO)) PO_NO,
    TO_CHAR (WM_CONCAT (PART_NO)) PART_NO,
    SUM (RECEIVED_QTY) RECEIVED_QTY,
    SUM (AMOUNT) AMOUNT,
    TO_CHAR (WM_CONCAT (EPTG_DESC)) EPTG_DESC,
    TO_CHAR (WM_CONCAT (MM_NO)) MM_NO,
    TO_CHAR (WM_CONCAT (INTEL_PN)) INTEL_PN
FROM (  SELECT A.PO_NO,
              A.PART_NO,
              A.RECEIVED_QTY,
              MHUB_UTILITY_PKG.GET_AMOUNT (A.INV_NO, A.INV_SNO) AMOUNT,
              B.EPTG_DESC,
              MHUB_UTILITY_PKG.GET_MM_NO (A.PART_DESC) AS MM_NO,
              A.PART_DESC AS G_MODEL,
              MHUB_INTEL_CONSIGN_PO_PKG.GET_INTEL_PART_NO (A.PART_NO)
                 AS INTEL_PN
         FROM MHUB_BND_EBPT_INTERFACE B, MHUB_INV_DTL A , MIL_LOOKUP_VALUES_ALL C
        WHERE A.PART_NO = B.DEPT_PART(+)
              AND B.EMS_NO = C.LOOKUP_CODE(+)
              AND C.LOOKUP_TYPE = 'DEFAULT_EMS_NO'
              AND A.PART_NO NOT IN
                     (SELECT V.PART_NO
                        FROM MHUB_INV_DTL V, MHUB_ASN_MST M
                       WHERE     M.LOT_NO = V.LOT_NO
                             AND M.OLD_LOT_NO = '${lot}'
                             AND M.PK_STATUS IN ('C', '9'))
              AND A.LOT_NO = '${lot}'
     ORDER BY A.PO_NO)`;
    return this.db.execute(sql).then(r => {
      const ls: any[] = r.rows;
      const nLs = [];
      const rq = [];
      let partNumberDetail;
      ls.reduce((a, b) => {
        a.push(
          this.db.execute(get_part_detail(b.LOT_NO2)).then(r1 => {
            const res = r1.rows;
            if (res.length > 0) {
              nLs.push(Object.assign(b, res[0]));
            } else {
              if (!partNumberDetail) {
                partNumberDetail = {};
                r1.metaData
                  .map(m => m.name)
                  .forEach(m => {
                    partNumberDetail[m] = '';
                  });
              }
              nLs.push(Object.assign({}, partNumberDetail, b));
            }
          }),
        );
        return a;
      }, rq);
      return Promise.all(rq).then(() => {
        // tslint:disable-next-line:no-console
        console.log(`getHubInvRep end at:${new Date()}`);
        return nLs.sort((a, b) =>
          sortUtils.byCharCode(a.VENDOR_SO, b.VENDOR_SO, true),
        );
      });
    });
  }

  async getHkDeclarationRep(query) {
    const { lotNo, dateFrom, dateTo } = query;
    // tslint:disable-next-line:no-console
    console.log(`getHkDeclarationRep start at:${new Date()}`);
    let sql = `SELECT PACKAGE_NO,
    TO_CHAR(WM_CONCAT(OLD_LOT_NO)) OLD_LOT_NO,
    VENDOR_NAME,
    CONNECT_FWD,
    HAWB,
    TO_CHAR(WM_CONCAT(LOT_NO)) LOT_NO,
    SUM(INV_AMOUNT) INV_AMOUNT,
    FWD_NAME,
    ETD_HK,
    SUM(TOTAL_QTY) TOTAL_QTY,
    WEIGHT,
    MAWB,
    SHIP_VIA,
    SO_REC,
    TOTAL_PALLET,
    TOTAL_CARTON,
    FLIGHT_NO,
    SEC_FOR FROM (SELECT DISTINCT PACKAGE_NO,
              A.OLD_LOT_NO,
              C.DELIV_PLA VENDOR_NAME,
              C.CONNECT_FWD,
              C.HAWB,
              A.LOT_NO,
              NVL ( (SELECT SUM (AMOUNT * 7.8)
                      FROM MHUB_INVOICE_LIST
                      WHERE LOT_NO = A.LOT_NO),
                  (SELECT SUM (AMOUNT * 7.8)
                      FROM MHUB_INV_DTL
                    WHERE LOT_NO = A.LOT_NO))
                INV_AMOUNT,
              A.FWD_NAME,
              TO_CHAR (A.MHK_ETD, 'yyyy-mm-dd') AS ETD_HK,
              A.TOTAL_QTY,
              C.WEIGHT,
              A.MAWB,
              A.SHIP_VIA,
              A.SO_REC,
              C.TOTAL_PALLET,
              C.TOTAL_CARTON + C.CARTON_1 TOTAL_CARTON,
              (SELECT FLIGHT_NO
                 FROM MHUB_BL_MST
                WHERE MAWB = A.MAWB)
                 FLIGHT_NO,
                (SELECT LOOKUP_LABEL
                  FROM MIL_LOOKUP_VALUES_ALL
                  WHERE  LOOKUP_TYPE='CONTACT_SEC_FORWARD'
                  AND LOOKUP_CODE= C.DEPOT_NO) SEC_FOR
          FROM MHUB_ASN_MST A, MHUB_SO_MST C
          WHERE     A.SO_REC = C.SO_NO
          AND A.PK_KIND = 2
          AND A.CUSTOMER_CODE = '00003'
          AND A.LOT_NO LIKE 'HO%'
          AND (C.SHIP_VIA='EXPRESS' OR EXISTS (
            SELECT 1 FROM MHUB_ASN_MST OLD
            WHERE  OLD.ORIGIN_SHIP_VIA='TRUCK'
            AND OLD.LOT_NO= A.OLD_LOT_NO
          ))`;

    // AND (UPPER (C.INHK_SHIP_VIA) = 'TRUCK'
    // OR UPPER (C.SHIP_VIA) = 'EXPRESS')`

    if (!this.util.isNull(lotNo)) {
      sql += ` AND C.LOT_NO LIKE '%${lotNo}%'`;
    }

    if (!this.util.isNull(dateFrom)) {
      sql += ` AND TRUNC(A.MHK_ETD)>=TO_DATE('${dateFrom}','YYYY-MM-DD')`;
    }

    if (!this.util.isNull(dateTo)) {
      sql += ` AND TRUNC(A.MHK_ETD)<=TO_DATE('${dateTo}','YYYY-MM-DD')`;
    }

    sql += `)
    GROUP BY PACKAGE_NO,
    VENDOR_NAME,
    CONNECT_FWD,
    HAWB,
    FWD_NAME,
    ETD_HK,
    WEIGHT,
    MAWB,
    SHIP_VIA,
    SO_REC,
    TOTAL_PALLET,
    TOTAL_CARTON,
    FLIGHT_NO,
    SEC_FOR `;
    const get_part_detail = (
      lot: string,
    ) => `SELECT TO_CHAR (WM_CONCAT (DISTINCT PART_DESC)) PART_DESC,
          TO_CHAR (WM_CONCAT (DISTINCT ORIGIN_COUNTRY)) ORIGIN_COUNTRY
      FROM MHUB_INVOICE_LIST b
      WHERE  EXISTS (SELECT 1
        FROM TABLE(SPLIT('${lot}', ',')) A
       WHERE A.COLUMN_VALUE = B.LOT_NO)`;

    const result = this.db
      .execute(sql, [], {
        autoCommit: true,
        outFormat: oracledb.OBJECT,
      })
      .then(r => {
        const ls: any[] = r.rows;
        const nLs = [];
        const rq = [];
        let partNumberDetail;
        ls.reduce((a, b) => {
          a.push(
            this.db
              .execute(get_part_detail(b.LOT_NO), [], {
                autoCommit: true,
                outFormat: oracledb.OBJECT,
              })
              .then(r1 => {
                const res = r1.rows;
                let palletcarton = '';
                if (b.TOTAL_PALLET === 0) {
                  palletcarton = b.TOTAL_CARTON + 'C';
                } else {
                  if (b.TOTAL_CARTON % b.TOTAL_PALLET === 0) {
                    palletcarton =
                      b.TOTAL_PALLET +
                      'P' +
                      '(' +
                      b.TOTAL_CARTON / b.TOTAL_PALLET +
                      ')';
                  } else {
                    palletcarton =
                      b.TOTAL_PALLET +
                      'P' +
                      '(' +
                      Math.floor(b.TOTAL_CARTON / b.TOTAL_PALLET) +
                      ')' +
                      (b.TOTAL_CARTON % b.TOTAL_PALLET) +
                      'C';
                  }
                }

                if (b.TOTAL_PALLET === 0 && b.TOTAL_CARTON === 0) {
                  palletcarton = b.PACKAGE_NO + 'C';
                }
                const re: any = Object.assign(b, { palletcarton });
                if (res.length > 0) {
                  nLs.push(Object.assign(re, res[0]));
                } else {
                  if (!partNumberDetail) {
                    partNumberDetail = {};
                    r1.metaData
                      .map(m => m.name)
                      .forEach(m => {
                        partNumberDetail[m] = '';
                      });
                  }
                  nLs.push(Object.assign({}, partNumberDetail, re));
                }
              }),
          );
          return a;
        }, rq);
        return Promise.all(rq).then(() => {
          // tslint:disable-next-line:no-console
          console.log(`getHkDeclarationRep end at:${new Date()}`);
          return nLs.sort((a, b) => {
            let re = sortUtils.byCharCode(a.ETD_HK, b.ETD_HK, true);
            if (re === 0) {
              re = sortUtils.byCharCode(a.MAWB, b.MAWB, true);
            }
            if (re === 0) {
              re = sortUtils.byCharCode(a.PART_DESC, b.PART_DESC, true);
            }
            return re;
          });
        });
      });
    return result;
  }

  async escmExchangeDatarep(query) {
    const {
      customerCode,
      selCom,
      buyCom,
      lotNo,
      pkNo,
      venderCode,
      venderName,
      siNo,
      dateFrom,
      dateTo,
      processFlag,
    } = query;

    let sql = `SELECT DISTINCT NVL(A.LOT_NO, 'N/A') AS LOT_NO,
        NVL(A.VENDOR_NAME, 'N/A') AS VENDOR_NAME,
        A.VENDOR_CODE,
        A.SI_NO,
        TO_CHAR(A.DOC_DATE,'YYYY-MM-DD') DOC_DATE,
        A.PROCESS_FLAG,
        (SELECT TO_CHAR(WM_CONCAT(PK_NO))
          FROM MHUB_ASN_MST_INTERFACE
          WHERE SI_NO = A.SI_NO) PK_NO,
        DECODE(A.PROCESS_FLAG,
              '1',
              '還未轉入iHUB中',
              '3',
              '已成功轉入iHUB中',
              4,
              '轉檔失敗') AS PROCESS_MSG,
        TO_CHAR(A.TRN_DATE,'YYYY-MM-DD HH24:MI:SS') AS PROCESS_DATE,
        (SELECT TRN_MSG
          FROM MHUB_EDI_ERMSG
          WHERE ITEM_TYPE = 'TRAN_HUBWEB_ASN'
            AND ITEM_NO = A.SI_NO
            AND A.PROCESS_FLAG = '4'
            AND ROWNUM = 1) ERR_MSG
    FROM MHUB_ASN_MST_INTERFACE A
    WHERE  CUSTOMER_CODE = '${customerCode}'`;

    if (!this.util.isNull(selCom)) {
      sql += ` AND SELLER_COMPANY = '${selCom}'`;
    }

    if (!this.util.isNull(buyCom)) {
      sql += ` AND BUYER_COMPANY = '${buyCom}'`;
    }

    if (!this.util.isNull(lotNo)) {
      sql += ` AND LOT_NO = '${lotNo}'`;
    }

    if (!this.util.isNull(pkNo)) {
      sql += ` AND PK_NO = '${pkNo}'`;
    }

    if (!this.util.isNull(venderCode)) {
      sql += ` AND VENDOR_CODE = '${venderCode}'`;
    }

    if (!this.util.isNull(venderName)) {
      sql += ` AND VENDOR_NAME LIKE '%${venderName}%'`;
    }

    if (!this.util.isNull(siNo)) {
      sql += ` AND SI_NO = '${siNo}'`;
    }

    if (!this.util.isNull(dateFrom)) {
      sql += ` AND TRUNC(TRN_DATE) >= TO_DATE('${dateFrom}','YYYY-MM-DD')`;
    }

    if (!this.util.isNull(dateTo)) {
      sql += ` AND TRUNC(TRN_DATE) <= TO_DATE('${dateTo}','YYYY-MM-DD')`;
    }

    if (!this.util.isNull(processFlag)) {
      sql += ` AND PROCESS_FLAG = '${processFlag}'`;
    }

    sql += ` ORDER BY PROCESS_FLAG, PROCESS_DATE DESC`;

    return await this.db.execute(sql);
  }
}
