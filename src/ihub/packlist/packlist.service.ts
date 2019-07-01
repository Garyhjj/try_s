import { CommonService } from './../shared/common.service';
import { Database } from './../../class/database.class';
import {
  MhubPacklistEntity,
  MhubPacklistInterface,
  Mhub_PacklistObject,
} from './packlist.dto';
import { Injectable } from '@nestjs/common';
import { UpdateObject } from '../../class/update-object.class';
import { UtilService } from '../../core/util.service';
import { sortUtils } from '../../shared/utils';

@Injectable()
export class PackListService {
  db: Database;
  constructor(private commonService: CommonService, private util: UtilService) {
    this.db = new Database(Mhub_PacklistObject, MhubPacklistEntity);
  }

  async searchMsts(filter: any, pi = 1, ps = 1000) {
    return await this.db.find(filter, pi, ps);
  }

  async getListByLot(LOT_NO: string) {
    return await this.db.execute(
      `select * from ${Mhub_PacklistObject.tableName} where LOT_NO ='${LOT_NO}'
      order by PALLET_FROM,CARTON_FROM`,
    );
  }

  async getListByLot2(LOT_NO: string) {
    return await this.db.execute(
      `SELECT A.*, NVL(B.DEPT_PART,A.PART_NO) DEPT_PART, NVL(B.EPTG_DESC , A.EPTG_DESC) EPTG_DESC
      FROM MHUB_PACKLIST A, MHUB_BND_EBPT_INTERFACE B
     WHERE A.PART_NO = B.DEPT_PART(+) AND A.LOT_NO ='${LOT_NO}'
        and A.EMS_NO = B.EMS_NO(+)
      order by A.PALLET_FROM,A.CARTON_FROM`,
    );
  }

  async getMstById(id: number) {
    return await this.db.execute(
      `select * from ${Mhub_PacklistObject.tableName} where id =${id}`,
    );
  }

  async createData(outLotNo: string, inLotNo: string, userId: number) {
    try {
      await this.db.execute(
        `BEGIN
        MHUB_OUTBOUND_PK_INV_PKG.CREATE_PACKING(
          '${outLotNo}'
      );
      END;`,
      );
    } catch (e) {
      throw new Error(e);
    }
    return 'Y';
  }

  async updateMst(body: MhubPacklistInterface[], userId: number) {
    let rowsAffected = 0;
    try {
      // body.forEach(async (row: MhubInvoiceListInterface) => {
      // });
      const res = await Promise.all(
        body.map(d => {
          return this.db.execute(
            `UPDATE MHUB_PACKLIST
         SET EPTG_DESC = '${d.EPTG_DESC}' ,
           C_N_WEIGHT= ${d.C_N_WEIGHT},TOTAL_C_N_WEIGHT= ${
            d.C_N_WEIGHT
            } * (CARTON_TO - CARTON_FROM + 1),
             C_G_WEIGHT= ${d.C_G_WEIGHT},TOTAL_C_G_WEIGHT= ${
            d.C_G_WEIGHT
            } * (CARTON_TO - CARTON_FROM + 1),
             LAST_UPDATE_DATE = SYSDATE,
             LAST_UPDATED_BY =  ${userId}
         WHERE ID = ${d.ID}`,
          );
        }),
      );

      if (res) {
        res.forEach(r => {
          rowsAffected += r.rowsAffected;
        });
      }

      return { rowsAffected };
    } catch (e) {
      throw new Error(e);
    }
  }

  async getPackHea(lotNo: string) {
    try {
      return await this.db.execute(
        `SELECT customer_code,
        buyer_company,
        lot_no,
        old_lot_no,
        vendor_name,
        pk_no,
       to_char(doc_date,'yyyy/mm/dd') doc_date,
        to_char(mhk_eta,'yyyy/mm/dd') mhk_eta,
        NVL (ship_via, 'N/A') AS ship_via,
        NVL (shipping_mark7, 'N/A') AS shipping_mark7,
        NVL (ship_to, 'N/A') AS ship_to,
        NVL (ship_to_tel, 'N/A') AS ship_to_tel,
        NVL (ship_to_fax, 'N/A') AS ship_to_fax,
        NVL ('attendant', 'N/A') AS attendant,
        ship_from,
        NVL (total_qty, 0) AS total_qty,
        NVL (total_carton, 0) AS total_carton,
        NVL (total_pallet, 0) AS total_pallet,
        NVL (total_package, 0) AS total_package,
        NVL (total_net_weight, 0) AS total_net_weight,
        pk_kind,
        pk_status,
        NVL (total_gross_weight, 0) AS total_gross_weight,
        weight_uom,
        quantity_uom,
        SHIPPING_MARK1,
        (SELECT PARENT_LOT FROM mhub_ASN_MST WHERE LOT_NO= A.OLD_LOT_NO) PARENT_LOT,
        SITE
   FROM mhub_ASN_MST A
  WHERE lot_no='${lotNo}'`,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async getReportInf(query) {
    try {
      const { lotNo, oldLotNo, hawb, mawb } = query;
      let sql = `SELECT A.CUSTOMER_CODE,
        A.BUYER_COMPANY,
        A.LOT_NO,
        A.OLD_LOT_NO,
        A.VENDOR_NAME,
        A.PK_NO,
        A.MAWB,
       TO_CHAR(DOC_DATE,'yyyy/mm/dd') DOC_DATE,
        TO_CHAR(MHK_ETA,'yyyy/mm/dd') MHK_ETA,
        NVL (SHIP_VIA, 'N/A') AS SHIP_VIA,
        NVL (SHIPPING_MARK7, 'N/A') AS SHIPPING_MARK7,
        NVL (SHIP_TO, 'N/A') AS SHIP_TO,
        NVL (SHIP_TO_TEL, 'N/A') AS SHIP_TO_TEL,
        NVL (SHIP_TO_FAX, 'N/A') AS SHIP_TO_FAX,
        NVL ('attendant', 'N/A') AS ATTENDANT,
        SHIP_FROM,
        NVL (A.TOTAL_QTY, 0) AS TOTAL_QTY,
        NVL (A.TOTAL_CARTON, 0) AS TOTAL_CARTON,
        NVL (A.TOTAL_PALLET, 0) AS TOTAL_PALLET,
        NVL (A.TOTAL_PACKAGE, 0) AS TOTAL_PACKAGE,
        PK_KIND,
        PK_STATUS,
        WEIGHT_UOM,
        QUANTITY_UOM,
        SHIPPING_MARK1,
        PARENT_LOT,
        SITE
   FROM MHUB_ASN_MST A
   WHERE A.PK_KIND='2' `;

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
           FROM MHUB_ASN_MST C
           WHERE  C.PK_KIND='0'
           AND C.MAWB='${mawb}'
           AND C.LOT_NO= A.OLD_LOT_NO)`;
      }

      sql += ` ORDER BY A.OLD_LOT_NO`;

      const detail = (lot_no: string) =>
        `SELECT A.*, NVL(B.DEPT_PART, A.PART_NO) DEPT_PART, NVL(B.EPTG_DESC,A.EPTG_DESC) EPTG_DESC
        FROM MHUB_PACKLIST A, MHUB_BND_EBPT_INTERFACE B
       WHERE A.PART_NO = B.DEPT_PART(+) AND A.LOT_NO ='${lot_no}'
         and  A.EMS_NO = b.EMS_NO(+)
        order by A.PALLET_FROM,A.CARTON_FROM`;

      return this.db.execute(sql).then(r => {
        const ls: any[] = r.rows;
        const nLs = [];
        const rq = [];
        let partNumberDetail;
        ls.reduce((a, b) => {
          a.push(
            this.db.execute(detail(b.LOT_NO)).then(r1 => {
              const res = r1.rows;
              let plt_sta, plt_end, car_sta, car_end;
              let totalQty = 0,
                totalCNWeight = 0,
                totalCGWeight = 0,
                totalCartonNum = 0,
                totalPackNum = 0,
                totalPackNumDes = '';
              let hasCartonType = false;
              let hasPalletType = false;
              let xflag = false;
              res.forEach(d => {
                if (
                  plt_sta === d.PALLET_FROM &&
                  plt_end === d.PALLET_TO &&
                  car_sta === d.CARTON_FROM &&
                  car_end === d.CARTON_TO
                ) {
                  d.PALLET_FROM = '';
                  d.PALLET_TO = '';
                  d.CARTON_FROM = '';
                  d.CARTON_TO = '';
                }
                plt_sta = d.PALLET_FROM;
                plt_end = d.PALLET_TO;
                car_sta = d.CARTON_FROM;
                car_end = d.CARTON_TO;
                d.TOTAL_C_N_WEIGHT = Number(d.TOTAL_C_N_WEIGHT.toFixed(2));
                d.C_N_WEIGHT = Number(d.C_N_WEIGHT.toFixed(2));
                d.TOTAL_C_G_WEIGHT = Number(d.TOTAL_C_G_WEIGHT.toFixed(2));
                d.C_G_WEIGHT = Number(d.C_G_WEIGHT.toFixed(2));
                totalQty += d.TOTAL_QTY;
                totalCNWeight += d.TOTAL_C_N_WEIGHT;

                totalCGWeight += d.TOTAL_C_G_WEIGHT;
                totalCGWeight = Number(totalCGWeight.toFixed(2));
                if (d.PACKAGE_TYPE === 'C') {
                  hasCartonType = true;
                }
                if (d.PACKAGE_TYPE === 'P') {
                  hasPalletType = true;
                }
              });
              const x_num = b.OLD_LOT_NO.indexOf('X');
              if (x_num === 0) {
                xflag = true;
                b.TOTAL_CARTON = 0;
                b.TOTAL_PALLET = 0;
                b.TOTAL_PACKAGE = 0;
              }
              if (
                b.PARENT_LOT !== '0' &&
                b.PARENT_LOT !== 'NA' &&
                !this.util.isNull(b.PARENT_LOT) &&
                b.OLD_LOT_NO.indexOf('T') === 0
              ) {
                xflag = true;
                b.TOTAL_CARTON = 0;
                b.TOTAL_PALLET = 0;
                b.TOTAL_PACKAGE = 0;
                totalCGWeight = 0;
              }

              totalQty = Number(totalQty.toFixed(2));
              totalCNWeight = Number(totalCNWeight.toFixed(2));
              if (
                (b.OLD_LOT_NO || '').indexOf('GD') === 0 ||
                (b.OLD_LOT_NO || '').indexOf('BLP') === 0 ||
                (b.PARENT_LOT || '').indexOf('GD') === 0
              ) {
                totalCGWeight = Number(totalCGWeight.toFixed(2));
              } else {
                if (totalCGWeight < 1 && totalCGWeight !== 0) {
                  totalCGWeight = 1;
                } else {
                  totalCGWeight = Number(totalCGWeight.toFixed(0));
                }
              }
              if (hasCartonType && !hasPalletType) {
                totalCartonNum = b.TOTAL_CARTON;
                totalPackNum = b.TOTAL_CARTON;
                totalPackNumDes = b.TOTAL_CARTON;
              }
              if (!hasCartonType && hasPalletType) {
                totalCartonNum = b.TOTAL_CARTON;
                totalPackNum = b.TOTAL_PALLET;
                totalPackNumDes = b.TOTAL_PALLET;
              }
              if (hasCartonType && hasPalletType) {
                totalCartonNum = b.TOTAL_CARTON;
                if (b.TOTAL_PALLET === b.TOTAL_PACKAGE) {
                  totalPackNum = b.TOTAL_PACKAGE;
                  totalPackNumDes = b.TOTAL_PACKAGE;
                } else {
                  const dis = Number(b.TOTAL_PACKAGE - b.TOTAL_PALLET);
                  totalPackNum = b.TOTAL_PACKAGE;
                  totalPackNumDes = `${b.TOTAL_PACKAGE} = ${
                    b.TOTAL_PALLET
                    }Pallet + ${dis}Carton`;
                }
              }
              const re: any = Object.assign(b, {
                xflag,
                totalQty,
                totalCNWeight,
                totalCGWeight,
                totalCartonNum,
                totalPackNum,
                totalPackNumDes,
              });
              if (res.length > 0) {
                nLs.push(Object.assign(re, { lines: res }));
              } else {
                if (!partNumberDetail) {
                  partNumberDetail = { lines: '' };
                  /* r1.metaData.map(m => m.name).forEach(m => {
                     partNumberDetail[m] = '';
                   });*/
                }
                nLs.push(Object.assign({}, partNumberDetail, re));
              }
            }),
          );
          return a;
        }, rq);
        return Promise.all(rq).then(() =>
          nLs.sort((a, b) =>
            sortUtils.byCharCode(a.OLD_LOT_NO, b.OLD_LOT_NO, true),
          ),
        );
      });
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

  async getPkCheck() {
    return await this.db.execute(
      `        SELECT (SELECT OLD_LOT_NO FROM MHUB_ASN_MST WHERE LOT_NO = A.LOT_NO) IN_LOT_NO,
      a.LOT_NO OUT_LOT_NO,
      A.TOTAL_QTY PK_TOTAL_QTY,
      A.TOTAL_WEIGHT PK_TOTAL_WEIGHT,
      NVL(B.TOTAL_QTY,0) IV_TOTAL_QTY,
      NVL(B.TOTAL_WEIGHT,0) IV_TOTAL_WEIGHT
 FROM (SELECT LOT_NO,
              SUM(TOTAL_QTY) TOTAL_QTY,
              SUM(TOTAL_C_N_WEIGHT) TOTAL_WEIGHT
         FROM Mhub_Packlist
        GROUP BY LOT_NO) A,
      (SELECT LOT_NO,
              SUM(RECEIVED_QTY) TOTAL_QTY,
              SUM(TOTAL_GROSS_WEIGHT) TOTAL_WEIGHT
         FROM MHUB_INVOICE_LIST
        GROUP BY LOT_NO) B
WHERE A.LOT_NO = B.LOT_NO(+)
  AND (A.TOTAL_QTY <> B.TOTAL_QTY OR B.TOTAL_QTY IS NULL OR A.TOTAL_WEIGHT <> B.TOTAL_WEIGHT) `,
    );
  }
}
