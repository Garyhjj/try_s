import { CommonService } from '../shared/common.service';
import {
  CombineSoMstEntity,
  CombineSoMstInterface,
  CombineSoMstObject,
} from './combine-so-mst.dto';
import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { Database } from '../../class/database.class';
import { UpdateObject } from '../../class/update-object.class';
import { UtilService } from '../../core/util.service';

@Injectable()
export class CombineSoMstService {
  db: Database;
  constructor(private commonService: CommonService, private util: UtilService) {
    this.db = new Database(CombineSoMstObject, CombineSoMstEntity);
  }

  async getWaitCombineList(onBoardDate: string, containerNo: string) {
    return await this.db.execute(`SELECT COMBINE_SO_NO,
            SO_NO,
            LOT_NO,
            ORIGIN_COUNT,
            SPE_INFO,
            HAWB,
            URGENT_NAME,
            GOODS,
            COMMODITY_INSPECTION,
            PACKING_LIST,
            TOTAL_PALLET,
            TOTAL_CARTON || TOTAL_CARTON_UOM TOTAL_CARTON,
            CARTON_1 || TOTAL_CARTON_UOM CARTON_1,
            PACKAGE_NO,
            WEIGHT,
            INBOUND_GW,
            CBM,
            COMBINE_LOT_TYPE
        FROM MHUB_COMBINE_SO_TEMP
        where  CONTAINER_NO = NVL ('${containerNo}', CONTAINER_NO)
        AND ONBOARD_DATE = NVL (TO_DATE('${onBoardDate}','YYYY-MM-DD'), ONBOARD_DATE)
        ORDER BY COMBINE_SO_NO`);
  }

  async getWaitCombineInf(onBoardDate: string, containerNo: string) {
    let sql = `SELECT * FROM (SELECT TO_CHAR(M.ONBOARD_DATE, 'YYYY-MM-DD') ONBOARD_DATE,
    M.CONTAINER_NO,
    COUNT(DISTINCT M.LOT_NO) AS SO_ROW,
    SUM(M.TOTAL_PALLET) TOTAL_PALLET,
    SUM(M.TOTAL_CARTON) TOTAL_CARTON,
    SUM(M.CARTON_1) TOTAL_CARTON_1,
    SUM(M.PACKAGE_NO) TOTAL_PACKAGE,
    SUM(M.WEIGHT) TOTAL_WEIGHT,
    SUM(NVL(M.VMEASURE, 0)) AS VMEASURE,
    MHUB_COMBINE_SO_PKG.GET_COMBINE_STATUS(M.ONBOARD_DATE,
                                           M.CONTAINER_NO) STATUS
FROM (select H.ONBOARD_DATE,
            H.CONTAINER_NO,
            s.LOT_NO,
            S.TOTAL_PALLET,
            S.TOTAL_CARTON,
            S.CARTON_1,
            S.PACKAGE_NO,
            S.WEIGHT,
            SUM(NVL(H.MEASURE, 0)) AS VMEASURE
       FROM MHUB_LABEL H, MHUB_SO_MST S
      WHERE H.SO_NO = S.SO_NO
        AND H.CUSTOMER_CODE = '00003'
        AND S.CUSTOMER_CODE = '00003'
        AND S.SO_STATUS = 'N'
        AND H.CONTAINER_NO IS NOT NULL
        AND H.ONBOARD_DATE IS NOT NULL
        AND H.STATUS = '3'
        AND H.SHIP_VIA = 'SEA'`;

    if (!this.util.isNull(containerNo)) {
      sql += `AND H.CONTAINER_NO='${containerNo}'`;
    }

    if (!this.util.isNull(onBoardDate)) {
      sql += `AND H.ONBOARD_DATE = TO_DATE('${onBoardDate}','YYYY-MM-DD')`;
    }

    if (this.util.isNull(containerNo) && this.util.isNull(onBoardDate)) {
      sql += `AND H.ONBOARD_DATE = TRUNC(SYSDATE)`;
    }

    sql += ` GROUP BY H.ONBOARD_DATE,
    H.CONTAINER_NO,
    S.LOT_NO,
    S.TOTAL_PALLET,
    S.TOTAL_CARTON,
    S.CARTON_1,
    S.PACKAGE_NO,
    S.WEIGHT) M
GROUP BY M.ONBOARD_DATE, M.CONTAINER_NO)
    ORDER BY ONBOARD_DATE DESC,STATUS DESC`;

    return await this.db.execute(sql);
  }

  async generateCombineData(onBoardDate: string, containerNo: string) {
    try {
      await this.db.execute(
        `BEGIN
      MHUB_COMBINE_SO_PKG.GENERATE_WAIT_COMBINE_DATA(
          TO_DATE('${onBoardDate}','YYYY-MM-DD'),
          '${containerNo}'
      );
      END;`,
      );
    } catch (e) {
      throw new Error(e);
    }
    return 'Y';
  }

  async autoCombineData(
    onBoardDate: string,
    containerNo: string,
    soWholeorPartial: string,
  ) {
    try {
      await this.db.execute(
        `BEGIN
      MHUB_COMBINE_SO_PKG.AUTO_COMBINE(
          TO_DATE('${onBoardDate}','YYYY-MM-DD'),
          '${containerNo}',
          '${soWholeorPartial}'
      );
      END;`,
      );
    } catch (e) {
      throw new Error(e);
    }
    return 'Y';
  }

  async singleCombineData(
    onBoardDate: string,
    containerNo: string,
    soList: string,
    soWholeorPartial: string,
  ) {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN
      MHUB_COMBINE_SO_PKG.SINGLE_COMBINE(
          TO_DATE(:1,'YYYY-MM-DD'),
          :2,:3,:4,:status
      );
      END;`,
        {
          1: onBoardDate,
          2: containerNo,
          3: soList,
          4: soWholeorPartial,
          status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    return result.outBinds ? result.outBinds : { status: 9 };
  }

  async getAllMst() {
    return await this.db.execute(
      `select * from ${CombineSoMstObject.tableName}`,
    );
  }

  async searchMsts(filter: any, pi = 1, ps = 10) {
    return await this.db.find(filter, pi, ps);
  }

  async getMstByContainerNo(onBoardDate: string, containerNo: string) {
    return await this.db.execute(
      `select a.*,MHUB_COMBINE_SO_PKG.HAS_BL_FLAG(A.COMBINE_SO_NO) BL_FLAG
      from ${
        CombineSoMstObject.tableName
      } a where onboard_date = TO_DATE('${onBoardDate}','YYYY-MM-DD')
      and container_no='${containerNo}'
      order by combine_so_no`,
    );
  }

  async deleteMstByCombineNo(
    onBoardDate: string,
    containerNo: string,
    combineNo: string,
  ) {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN
      MHUB_COMBINE_SO_PKG.DELETE_COMBINE(
          TO_DATE(:1,'YYYY-MM-DD'),
          :2,:3,:status
      );
      END;`,
        {
          1: onBoardDate,
          2: containerNo,
          3: combineNo,
          status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    return result.outBinds ? result.outBinds : { status: 9 };
  }

  async finishCombine(onBoardDate: string, containerNo: string) {
    let result: any;
    try {
      result = await this.db.execute(
        `BEGIN
      MHUB_COMBINE_SO_PKG.FINISH_COMBINE(
          TO_DATE(:1,'YYYY-MM-DD'),
          :2,:status
      );
      END;`,
        {
          1: onBoardDate,
          2: containerNo,
          status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
      );
    } catch (e) {
      throw new Error(e);
    }
    return result.outBinds ? result.outBinds : { status: 9 };
  }

  async createMst(body: CombineSoMstInterface, userId: number) {
    try {
      // 先根据LOT_CODE获取LOT_NO
      /* const lotNoRes = await this.db.execute(
         `SELECT MHUB_MAX_LOTNO_PKG.GET_MAX_LOT_NO('${
           body.LOT_CODE
         }') LOT_NO FROM DUAL`,
       );*/
    } catch (e) {
      throw new Error(e);
    }

    // console.log(body);
    try {
      const res = await this.db.insert(body, userId);
      return body;
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateMst(body: UpdateObject, userId: number) {
    try {
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

  async deleteBySo(soNo: string) {
    return this.db.execute(
      `DELETE FROM MHUB_COMBINE_SO_TEMP
      WHERE SO_NO = '${soNo}'`,
    );
  }
}
