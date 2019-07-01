import { async } from 'rxjs/internal/scheduler/async';
import { Database } from '../../class/database.class';
import { CommonService } from '../shared/common.service';
import { SoMstEntity, SoMstObject, SoMstInterface } from './so-mst.dot';
import { Injectable } from '@nestjs/common';

import { UpdateObject } from '../../class/update-object.class';
import { toStoreString } from '../../shared/tables';

@Injectable()
export class SoMstService {
  db: Database;
  constructor(private commonService: CommonService) {
    this.db = new Database(SoMstObject, SoMstEntity);
  }

  async updateSoMst(body: UpdateObject, userId: number) {
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async createSoMst(body: SoMstInterface, userId: number) {
    try {
      await this.db.insert(body, userId);
      /*           const newSo = await this.db.find({ LOT_NO: body.LOT_NO });
          if (newSo.rows.length > 0) {
            return newSo.rows[0];
          } else {
            return {};
          } */
    } catch (e) {
      throw new Error(e);
    }
  }

  async getSoMst(so_no: string, lot_no: string) {
    let sql;
    if (so_no) {
      sql = ` SELECT * FROM MHUB_SO_MST WHERE SO_NO='${so_no}' AND SO_STATUS='N'  `;
    } else {
      sql = ` SELECT SM.* FROM MHUB_SO_MST SM,MHUB_SO_DTL SD WHERE SD.SO_NO=SM.SO_NO
        AND SD.LOT_NO=SM.LOT_NO AND SM.SO_STATUS='N' AND SD.SO_STATUS='N'
        AND SD.LOT_NO='${lot_no}'  `;
    }
    return this.db.execute(sql);
  }

  async getSoMstByLot(lot_no: string) {
    let sql;

    sql = `  SELECT AM.LOT_NO, NVL(TO_CHAR(WM_CONCAT(IM.INV_NO)),AM.PK_NO) INV_NO,AM.VENDOR_NAME,AM.VENDOR_NAME SHIPPER, AM.KEYIN_MH USER_CODE,
    AM.SHIP_VIA INHK_SHIP_VIA,NULL SO_NO,AM.SHIPPING_MARK2 CONNECT_FWD,AM.SHIPPING_MARK3 SIGN_MSG,AM.PACKAGE_TYPE ATTRIBUTE7,
    MHUB_GET_PK_CARTON_PALLET_INFO('${lot_no}','P') TOTAL_PALLET,
    MHUB_GET_PK_CARTON_PALLET_INFO('${lot_no}','PC') TOTAL_CARTON,
    MHUB_GET_PK_CARTON_PALLET_INFO('${lot_no}','C') CARTON_1,
    MHUB_GET_PK_CARTON_PALLET_INFO('${lot_no}','PA') PACKAGE_NO,
    AM.HAWB,AM.MAWB,AM.TRANS_NO FLT_NO,AM.SHIP_FROM DELIV_PLA,AM.TOTAL_GROSS_WEIGHT WEIGHT, AM.KEYIN_MH USER_CODE
FROM MHUB_ASN_MST AM  ,MHUB_INV_MST IM
WHERE    AM.LOT_NO = '${lot_no}' AND AM.LOT_NO = IM.LOT_NO(+)
 AND ( AM.PK_STATUS  IN ('0','1', '2')  OR AM.SHIP_VIA='EXPRESS' )
AND NOT EXISTS (SELECT SD.LOT_NO FROM MHUB_SO_DTL SD WHERE SD.LOT_NO=AM.LOT_NO AND SD.SO_STATUS='N' )
GROUP BY AM.LOT_NO,AM.KEYIN_MH,AM.TOTAL_GROSS_WEIGHT,
    AM.SHIP_VIA,AM.HAWB,AM.MAWB,AM.TRANS_NO,AM.VENDOR_NAME,
    AM.SHIP_FROM,AM.PACKAGE_TYPE,AM.SHIPPING_MARK2,AM.SHIPPING_MARK3,AM.PK_NO `;

    return this.db.execute(sql);
  }

  async getSoNo(ship_via: string) {
    let sql;
    sql = ` SELECT MHUB_GET_SO_NO('${ship_via}') SO_NO FROM DUAL  `;
    return this.db.execute(sql);
  }

  async insertSoDtl(customer: string, seller: string, buyer: string, so_no: string, so_line: number,
                    lot_no: string, ship_via: string, user_id: number){
    let sql ;
    sql = ` INSERT INTO MHUB_SO_DTL (ID,CUSTOMER_CODE,SELLER_COMPANY,BUYER_COMPANY,SO_NO,VERSION,
            LINE_NUMBER,LOT_NO,REF1,REF2,REF3,SO_STATUS,CREATION_DATE,CREATED_BY,LAST_UPDATE_DATE,LAST_UPDATED_BY)
            VALUES (MHUB_SO_DTL_SEQ.NEXTVAL,'${customer}','${seller}','${buyer}',
            '${so_no}',1,${so_line},'${lot_no}',NULL,NULL,'${ship_via}','N',SYSDATE,${user_id},NULL,NULL) `;

    return this.db.execute(sql);
  }

  async updateSoRec(lot_no: string, so_no: string) {
     return this.db.execute(
       `UPDATE MHUB_ASN_MST SET SO_REC = '${so_no}', IS_CREATED_SO = 'Y' WHERE  LOT_NO='${lot_no}' `,
     );
  }

  sendSoMail(so_no: string) {
    this.db.execute(`begin
    mhub_auto_so_pkg.auto_so_mail('${so_no}');
     end; `);
  }

  async cancelSoMst(so_id: number, so_no: string) {
    this.db.execute(
      `UPDATE MHUB_SO_MST SET SO_STATUS='C' WHERE  ID=${so_id} `,
    );

    return this.db.execute(
      `UPDATE MHUB_SO_DTL SET SO_STATUS='C' WHERE  SO_NO='${so_no}' `,
    );
  }

}
