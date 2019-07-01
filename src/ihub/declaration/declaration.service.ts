import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { sortUtils } from './../../shared/utils/index';
import { RenderService } from './../../shared/services/render.service';
import { EmailService } from './../../shared/services/email.service';
import {
  CloseErrorRemarkObject,
  CloseErrorRemarkEntity,
} from './close-error-remark.dto';
import { Injectable } from '@nestjs/common';
import {
  toStoreDate,
  toStoreString,
  getStoreDateRange,
} from '../../shared/tables';
import { CustomListEntity, CustomListObject } from './custom-list.dto';
import {
  ReceivedWhDateObject,
  ReceivedWhDateEntity,
} from './received-wh-date.dto';
import { resolve } from 'path';
import { CacheResult } from '../../shared/decorators';
import { isProduction } from '../../config/config';

@Injectable()
export class DeclarationService {
  db: DatabaseTable;
  dateDb: DatabaseTable;
  errorDB: DatabaseTable;
  constructor(
    private emailService: EmailService,
    private renderService: RenderService,
    private databaseService: DatabaseService,
  ) {
    this.db = this.databaseService.getTableInstance(
      CustomListObject,
      CustomListEntity,
    );
    this.dateDb = this.databaseService.getTableInstance(
      ReceivedWhDateObject,
      ReceivedWhDateEntity,
    );
    this.errorDB = this.databaseService.getTableInstance(
      CloseErrorRemarkObject,
      CloseErrorRemarkEntity,
    );
  }

  @CacheResult()
  async getImportDeclarations2({ mhk_etd }) {
    if (!mhk_etd) {
      return [];
    }
    const [from, to] = getStoreDateRange(mhk_etd);
    const sql1 = `SELECT NVL(AM.MHK_ETD,AM.MHK_ETA +1) MHK_ETD,
    FWD_NAME AS SECOND_FWD,
    FSD.SO_NO,
    AM.OLD_LOT_NO,
    AM.LOT_NO,
    AM.TOTAL_QTY,
    AM.TOTAL_CARTON,
    AM.TOTAL_PALLET,
    AM.TOTAL_PACKAGE,
    AM.VENDOR_NAME,
    FS.CONNECT_FWD,
    FS.INHK_SHIP_VIA,
    AM.SHIP_VIA,
    AM.MAWB,
    FS.HAWB,
    AM.TRANS_NO,
    AM.ATTENDANT AS CONTAINER_TRUCK_TYPE,
    AM.WAREHOUSE_CODE AS CONTAINER_NO,
    FS.WEIGHT,
    (SELECT NVL (SUM (ROUND (INV.AMOUNT, 2)), 0)
       FROM mhub_INVOICE_LIST INV, mhub_ASN_MST mst
      WHERE INV.lot_no = mst.LOT_NO AND mst.lot_no = AM.LOT_NO)
       AMOUNT
    FROM mhub_ASN_MST AM, mhub_SO_MST FS, mhub_SO_DTL FSD
    WHERE     PK_KIND = '2'
    AND AM.OLD_LOT_NO = FS.LOT_NO
    AND FS.SO_NO = FSD.SO_NO
    AND NVL(AM.MHK_ETD,trunc(AM.MHK_ETA+1)) >= ${from}
    AND NVL(AM.MHK_ETD,trunc(AM.MHK_ETA+1)) <= ${to}
    AND FS.SO_STATUS != 'C'
    AND FSD.SO_STATUS != 'C'`;
    return this.db.search(sql1);
  }

  @CacheResult()
  async getImportDeclarations({ doc_date }) {
    if (!doc_date) {
      return [];
    }
    const [from, to] = getStoreDateRange(doc_date);
    const sql1 = `SELECT AM.DOC_DATE,
    AM.LOT_NO,
    AM.VENDOR_NAME,
    FS.CONNECT_FWD,
    FS.INHK_SHIP_VIA,
    FS.HAWB,
    FS.SHIP_VIA,
    (SELECT NVL (SUM (ROUND (INV.AMOUNT, 2)), 0)
       FROM mhub_INVOICE_LIST INV, mhub_ASN_MST mst
      WHERE INV.lot_no = mst.LOT_NO AND mst.old_lot_no = AM.LOT_NO)
       AMOUNT
     FROM mhub_asn_mst AM, mhub_SO_mst FS, mhub_so_dtl FSD
     WHERE AM.DOC_DATE >= ${from}
    AND AM.DOC_DATE <= ${to}
    and AM.pk_kind = 0
    AND FS.SO_NO = FSD.SO_NO
    AND AM.LOT_NO = FSD.LOT_NO
    AND FS.INHK_SHIP_VIA IN ('AIR', 'SEA', 'EXPRESS')
    AND (    AM.VENDOR_NAME NOT LIKE '%HK%'
         AND AM.VENDOR_NAME NOT LIKE '%H.K%'
         AND UPPER (AM.VENDOR_NAME) NOT LIKE '%HONGKONG%'
         AND AM.VENDOR_NAME NOT LIKE '%香港%')`;
    return this.databaseService.search(sql1);
  }

  @CacheResult()
  async getPermitDeclarations({ board_date }) {
    if (!board_date) {
      return [];
    }
    const [from, to] = getStoreDateRange(board_date);
    const sql1 = `SELECT V.MAWB AS BL_NO,V.BJ,V.SO_NO,V.LOT_NO,V.PART_NO,
    SUM(V.TOTAL_QTY) AS QUANTITY, V.FULL_PRODUCT_DESC,NVL(V.LICENCE_NO,'N/A')
    AS LICENCE_NO,NVL(V.PRE_CLASS,'N/A') AS PRE_CLASS FROM MHUB_HK_INOUT_CONTROL_V V where V.ONBOARD_DATE>=${from}
    and V.ONBOARD_DATE<=${to}
    and v.BUYER_COMPANY = '00003'
     GROUP BY V.MAWB,V.BJ,V.SO_NO,V.LOT_NO,V.PART_NO, V.FULL_PRODUCT_DESC,V.LICENCE_NO,V.PRE_CLASS`;
    return this.databaseService.search(sql1);
  }
  async changeInspectionDeclarations(body, userID) {
    const { MAWB } = body;
    if (!MAWB) {
      return Promise.reject('数据不够');
    }
    return this.db.execute(
      `update mhub_bl_mst set ATTRIBUTE7 ='${
      body.ATTRIBUTE7
      }',last_update_date = sysdate, last_updated_by = ${userID} where MAWB ='${MAWB}' and HAWB ='${MAWB}'`,
    );
  }
  @CacheResult()
  async getInspectionDeclarations({ board_date, status, ems_no }) {
    ems_no = ems_no || 'E51508000003';
    status = toStoreString(status);
    ems_no = toStoreString(ems_no);
    const [from, to] = getStoreDateRange(board_date);
    const sql1 = `SELECT A.*,ONBOARD_DATE+1 AS BJ FROM MHUB_BL_MST A WHERE BUYER_COMPANY='00003'
    AND (${from} is null or trunc(ONBOARD_DATE) >= ${from})
    and (${to} is null or trunc(ONBOARD_DATE) <= ${to})`;
    return this.db.search(sql1).then(async r => {
      const list: any[] = r,
        nLs = [],
        req = [];
      list.forEach(l => {
        if (l.LOT_NO) {
          const lot = l.LOT_NO.split(',')
            .filter(_ => _)
            .map(_ => toStoreString(_));
          const sql2 = `SELECT A.lot_no as out_lot_no, B.HS_CODE_T,B.EPTG_DESC,A.ORIGIN_COUNTRY,SUM(A.RECEIVED_QTY) AS QTY
              ,SUM(A.AMOUNT) AS AMOUNT ,B.ATTRIBUTE3,B.ATTRIBUTE4, b.DEPT_PART
              FROM MHUB_BND_EBPT_INTERFACE B, MHUB_INVOICE_LIST A WHERE  B.DEPT_PART=A.PART_NO AND
              (b.ems_no=${ems_no})
              AND exists (select lot_no from mhub_asn_mst d where d.pk_kind='2' and d.MAWB='${
            l.MAWB
            }' and d.old_lot_no IN (${lot}))
             AND EXISTS (SELECT 1 FROM MIL_LOOKUP_VALUES_ALL C WHERE LOOKUP_TYPE = 'BND' AND C.LOOKUP_CODE= B.HS_CODE_T)
               GROUP BY A.lot_no,ORIGIN_COUNTRY,B.HS_CODE_T,EPTG_DESC,B.ATTRIBUTE3,B.ATTRIBUTE4,b.DEPT_PART`,
            sql3 = ` SELECT a.lot_no,b.hs_code_t, b.eptg_desc, a.origin_country, SUM (a.total_qty) AS total_qty, SUM (a.total_c_n_weight) AS n_weight,
            SUM (total_carton) AS total_carton ,b.attribute3,b.attribute4,b.DEPT_PART
               FROM MHUB_BND_EBPT_INTERFACE b, MHUB_PACKLIST a WHERE b.dept_part = a.part_no AND
               (b.ems_no=${ems_no})
               AND exists (select lot_no from mhub_asn_mst d where d.pk_kind='2' and d.MAWB='${
              l.MAWB
              }' and d.old_lot_no IN (${lot})
              AND D.LOT_NO=A.lot_no)
               AND EXISTS (SELECT 1 FROM MIL_LOOKUP_VALUES_ALL C WHERE LOOKUP_TYPE = 'BND' AND C.LOOKUP_CODE= B.HS_CODE_T)
               GROUP BY  a.lot_no,b.hs_code_t, b.eptg_desc, a.origin_country , b.attribute3, b.attribute4, b.DEPT_PART`;

          req.push(
            this.db
              .search(
                `select e.*,f.AMOUNT,
                (select old_lot_no from mhub_asn_mst where pk_kind=2 and lot_no=e.lot_no) IN_LOT_NO from ( ${sql3} ) e,(${sql2} ) f
            where  e.HS_CODE_T=f.HS_CODE_T and e.ORIGIN_COUNTRY=f.ORIGIN_COUNTRY  and e.TOTAL_QTY=f.QTY
            AND e.EPTG_DESC=f.EPTG_DESC and e.lot_no = f.out_lot_no and e.DEPT_PART = f.DEPT_PART`,
                { isBusy: true, cacheTime: 1000 * 10 },
                // and e.TOTAL_QTY=f.QTY
              )
              .then(ls1 => {
                if (ls1.length > 0) {
                  for (let i = 0; i <= ls1.length - 1; i++) {
                    const temp = Object.assign({}, l, ls1[i]);
                    nLs.push(temp);
                  }
                  // ls1.forEach(_ => {
                  //   nLs.push(Object.assign(l, _));
                  // });
                }
              }),
          );
        }
      });
      await Promise.all(req);
      // if ( isProduction()) {
      //   return nLs;
      // }
      const allCC = await this.databaseService.search(
        `select CCC_NO1, ITEM_NO from MPO_CCC_CERTIFICATION_ALL@R12erp`,
      );
      const allWithC = nLs.map(l => {
        const out = { ...l };
        const tar = allCC.find(c => c.ITEM_NO === l.DEPT_PART);
        out.CCC_NO = tar ? tar.CCC_NO1 : '';
        return out;
      });
      return allWithC;
    });
  }

  @CacheResult()
  async getDeclarationForRate({ bj_date }) {
    if (!bj_date) {
      return [];
    }
    bj_date = toStoreDate(bj_date);
    return this.db.search(
      `select ETA_RQ, CUSTOMS_TIME, LOT_NO from ${CustomListObject.tableName}
    where CUSTOMS_TYPE='M-Material' and CUSTOMS_FLAG='1'  and  ship_via='SEA' and ETA_RQ=${bj_date}
    and BUYER_COMPANY='00003'`,
    );
  }

  @CacheResult()
  async getUnFisishAndUrgentDeclarations() {
    return this.db
      .search(
        `select * from (select distinct a.CONTAINER_NO,a.mawb,a.buyer_company,a.LOT_NO, a.ONBOARD_DATE+1 bj
      from mhub_bl_mst a, MHUB_COMBINE_SO_DTL b,MHUB_SO_DTL c
      where exists (select IS_URGENT from mhub_asn_mst d where d.IS_URGENT='Y' and d.OLD_LOT_NO = c.LOT_NO)
      and not exists (select 1 from mhub_asn_mst e where e.pk_status = 'C' and e.OLD_LOT_NO = c.LOT_NO)
       and b.COMBINE_SO_NO=a.NOTIFY_PHONE and  c.SO_NO=b.SO_NO and a.buyer_company='00003'
      and c.SO_STATUS='N' ) aa
       where not exists  (select distinct bb.bl_no from mhub_custom_list bb
         where  aa.mawb=bb.bl_no and bb.customs_flag='1' and bb.customs_time is not null )`,
      )
      .then(list => {
        const rq = [];
        list.forEach(l => {
          if (l.LOT_NO) {
            const lot = l.LOT_NO.split(',')
              .filter(_ => _)
              .map(_ => toStoreString(_));
            rq.push(
              this.db
                .search(
                  `select LOT_NO,URGENT_STATE_CODE, USER_NAME from MHUB_URGENT_SHIPMENT where LOT_NO in (${lot})`,
                  { isBusy: true },
                )
                .then(r1 => {
                  l.urgentDetails = r1;
                }),
            );
          }
        });
        return Promise.all(rq).then(() => list);
      });
  }

  @CacheResult()
  async getDeclarationsBeforeOrAfter({
    lot_no,
    bl_no,
    ship_via,
    bj_date,
    container_no,
    co_type,
    ok_date,
  }) {
    if (!bj_date) {
      return [];
    }
    const hasSubSearch = !!co_type || !!ok_date;
    lot_no = toStoreString(lot_no);
    bl_no = toStoreString(bl_no);
    ship_via = toStoreString(ship_via);
    container_no = toStoreString(container_no);
    const [_rq_date_f, _rq_date_t] = getStoreDateRange(bj_date);
    const before_sql = `select doc_date,pk_status,customer_code,MHK_ETA,buyer_company,
    old_lot_no,pk_kind,lot_no,MHK_ETA  as hk,(MHK_ETA+1)  as bj, MAWB, HAWB, TRANS_NO,ship_via,IS_URGENT,
    WAREHOUSE_CODE  as container_no from mhub_asn_mst where customer_code='00003' And pk_status in ('9', 'C')
    and (${bl_no} is null or mawb = ${bl_no}) and (${lot_no} is null or old_lot_no = ${lot_no})
    and (${ship_via} is null or ship_via = ${ship_via})
    and (${_rq_date_f} is null or trunc(MHK_ETA+1) >= ${_rq_date_f})
    and (${_rq_date_t} is null or trunc(MHK_ETA+1) <= ${_rq_date_t})
    and (${container_no} is null or WAREHOUSE_CODE = ${container_no})`;
    co_type = toStoreString(co_type);
    const [re_date_f, _re_date_t] = getStoreDateRange(ok_date);
    const customListTable = await this.databaseService.execute(
      `select * from ${CustomListObject.tableName}
    where (${co_type} is null or COMMERCE_TYPE = ${co_type})
    and (${re_date_f} is null or to_date(to_char(CUSTOMS_TIME,'yyyymmdd'),'yyyymmdd') >= ${re_date_f})
    and (${_re_date_t} is null or to_date(to_char(CUSTOMS_TIME,'yyyymmdd'),'yyyymmdd') <= ${_re_date_t})`,
      undefined,
      undefined,
      { cacheTime: 3000 },
    );
    const allCustomList = customListTable.rows;
    const customListMetadata = customListTable.metaData;
    return this.db.search(before_sql).then(ls => {
      let emptyCustom;
      if (!hasSubSearch) {
        if (!emptyCustom) {
          emptyCustom = {};
          customListMetadata.map(m => m.name).forEach(m => {
            emptyCustom[m] = '';
          });
        }
      }
      return ls.map(l => {
        const tar = allCustomList.find(
          _ => _.LOT_NO === l.OLD_LOT_NO && _.BL_NO === l.MAWB,
        );
        if (tar) {
          return Object.assign(l, tar);
        } else {
          return Object.assign({}, emptyCustom, l);
        }
      });
    });
  }

  @CacheResult()
  async getAsnForDeclarations(query) {
    const { type, rq_date, lot_no, mawb } = query;
    const _rq_date = rq_date || '';
    const _rq_date_arr = _rq_date.split(',');
    const _rq_date_f = toStoreDate(_rq_date_arr[0], 'yyyymmdd', 'YYYYMMDD');
    const _rq_date_t = toStoreDate(_rq_date_arr[1], 'yyyymmdd', 'YYYYMMDD');
    let sql = '';
    if (!type) {
      if (lot_no || mawb) {
        const lot_no_s = toStoreDate(lot_no),
        mawb_s = toStoreString(mawb);
        sql = `select * from ( select doc_date,pk_status,customer_code,MHK_ETA,buyer_company,
          old_lot_no,pk_kind,lot_no,MHK_ETA  as hk,MHK_ETA  as bj, MAWB, HAWB, TRANS_NO,ship_via,IS_URGENT,
          WAREHOUSE_CODE  as container_no from mhub_asn_mst ) a  where
        not exists (select  bl_no from mhub_custom_list b  where b.bl_no=a.mawb
           and b.LOT_NO=a.old_lot_no and  b.bl_no is not null and b.customs_time is not null )
           and  a.pk_kind='2' and a.customer_code='00003' and a.pk_status in ('9','C')
           and (${lot_no_s} is null or a.old_lot_no = ${lot_no_s})
           and (${mawb_s} is null or a.MAWB = ${mawb_s})`;
        return this.db.search(sql);
      }else {
        return [];
      }
    }
    if (type < 4) {
      sql = `select a.*, (select old_lot_no from mhub_asn_mst where customer_code='00003' And pk_kind='2' and mawb = a.mawb and rownum =1) old_lot_no,
      (select ship_type from mhub_asn_mst where customer_code='00003' And pk_kind='2' and mawb = a.mawb and rownum =1) ship_type
       from
        ( select NOTIFY_PHONE,ONBOARD_DATE,buyer_company,mawb,
            ship_via,ONBOARD_DATE as  hk,ONBOARD_DATE+1  bj,container_no from mhub_bl_mst )  a
        where not exists (select  bl_no from mhub_custom_list b where b.bl_no=a.mawb
            and  b.bl_no is not null and b.customs_time is not null )`;
      switch (+type) {
        case 1:
          sql += `and not exists ( select  * from mhub_so_mst c  where c.SO_NO in
                  (select d.SO_NO from mhub_COMBINE_SO_DTL d where d.COMBINE_SO_NO=a.NOTIFY_PHONE) and c.goods in('電子貨物','設備'))`;
          break;
        case 2:
          sql += `and exists ( select  * from mhub_so_mst c
                where c.so_no in (select d.so_no from mhub_COMBINE_SO_DTL d where d.COMBINE_SO_NO=a.NOTIFY_PHONE) and c.lot_no like '%RMA%')`;
          break;
        case 3:
          sql += `and  exists ( select  * from mhub_so_mst c  where c.so_no in
            (select d.so_no from mhub_COMBINE_SO_DTL d where d.COMBINE_SO_NO=a.NOTIFY_PHONE) and c.goods='設備')`;
          break;
      }
      sql += `and (${_rq_date_f} is null or trunc(a.ONBOARD_DATE) >= ${_rq_date_f})
      and (${_rq_date_t} is null or trunc(a.ONBOARD_DATE) <= ${_rq_date_t})`;
      return this.db.search(sql).then(ds => {
        let ls = [];
        const req = [];
        ds.forEach(d => {
          req.push(
            this.db
              .search(
                `select doc_date,pk_status,customer_code,MHK_ETA,buyer_company,
          old_lot_no,pk_kind,lot_no,MHK_ETA  as hk,MHK_ETA  as bj, MAWB, HAWB, TRANS_NO,ship_via,IS_URGENT,
          WAREHOUSE_CODE  as container_no from mhub_asn_mst where customer_code='00003' And pk_kind='2' and mawb is not null and mawb = '${
                d.MAWB
                }' and rownum =1`,
                { isBusy: true },
              )
              .then(r => {
                ls = ls.concat(r.map(_ => Object.assign(_, d)));
              }),
          );
        });
        return Promise.all(req).then(() => ls);
      });
    } else if (type > 3) {
      sql = `select * from ( select doc_date,pk_status,customer_code,MHK_ETA,buyer_company,
            old_lot_no,pk_kind,lot_no,MHK_ETA  as hk,MHK_ETA  as bj, MAWB, HAWB, TRANS_NO,ship_via,IS_URGENT,
            WAREHOUSE_CODE  as container_no from mhub_asn_mst ) a  where
          not exists (select  bl_no from mhub_custom_list b  where b.bl_no=a.mawb
             and b.LOT_NO=a.old_lot_no and  b.bl_no is not null and b.customs_time is not null )
             and  a.pk_kind='2' and a.customer_code='00003' and ship_via='{via}' and a.pk_status in ('9','C')`;
      switch (+type) {
        case 4:
          sql = sql.replace('{via}', 'TRUCK');
          break;
        case 5:
          sql = sql.replace('{via}', 'EXPRESS');
          break;
        case 6:
          sql = sql.replace('{via}', 'H/C');
          break;
        case 7:
          sql = `select * from ( select doc_date,pk_status,customer_code,MHK_ETA,buyer_company,
            old_lot_no,pk_kind,lot_no,MHK_ETA  as hk,MHK_ETA  as bj, MAWB, HAWB, TRANS_NO,'AIR' as ship_via,IS_URGENT,
            WAREHOUSE_CODE  as container_no from mhub_asn_mst ) a  where
          not exists (select  bl_no from mhub_custom_list b  where b.bl_no=a.mawb
             and b.LOT_NO=a.old_lot_no and  b.bl_no is not null and b.customs_time is not null )
             and  a.pk_kind='2' and a.customer_code='00003' and
             exists (select 1 from mhub_asn_mst b where b.lot_no = a.old_lot_no and trim(b.ship_via)='AIR' and b.pk_kind='0' )
             and a.pk_status in ('9','C')`;
          // sql = sql.replace('{via}', 'OTHERS');
          // sql = `select * from ( select doc_date,pk_status,customer_code,MHK_ETA,buyer_company,
          //   old_lot_no,pk_kind,lot_no,MHK_ETA  as hk,MHK_ETA  as bj, MAWB, HAWB, TRANS_NO,ship_via,IS_URGENT,
          //   WAREHOUSE_CODE  as container_no from mhub_asn_mst ) a  where
          // not exists (select  bl_no from mhub_custom_list b  where b.bl_no=a.mawb
          //    and b.LOT_NO=a.old_lot_no and  b.bl_no is not null and b.customs_time is not null )
          //    and  a.pk_kind='2' and a.customer_code='00003' and (a.old_lot_no like 'GD%' or a.old_lot_no like 'X%') and a.pk_status in ('9','C')`;
          break;
        case 8:
          sql = `select * from ( select doc_date,pk_status,customer_code,MHK_ETA,buyer_company,
            old_lot_no,pk_kind,lot_no,MHK_ETA  as hk,MHK_ETA  as bj, MAWB, HAWB, TRANS_NO,ship_via,IS_URGENT,
            WAREHOUSE_CODE  as container_no from mhub_asn_mst ) a  where
          not exists (select  bl_no from mhub_custom_list b  where b.bl_no=a.mawb
             and b.LOT_NO=a.old_lot_no and  b.bl_no is not null and b.customs_time is not null )
             and  a.CUSTOMER_CODE='00003' and a.BUYER_COMPANY='00005' and a.pk_kind='2' and a.pk_status in ('9','C')
          and a.doc_date> to_date('20041110','yyyymmdd')`;
          break;
      }
      sql += `and (a.MHK_ETA is null or((${_rq_date_f} is null or trunc(a.MHK_ETA) >= ${_rq_date_f})
      and (${_rq_date_t} is null or trunc(a.MHK_ETA) <= ${_rq_date_t})))`;
    }
    if (!sql) {
      return [];
    }
    return this.db.search(sql);
  }
  updateDeclaration(body, userID) {
    const { OUTLOT_NO, BL_NO } = body;
    return this.db
      .search(
        `select 1 from ${
        CustomListObject.tableName
        } where OUTLOT_NO = '${OUTLOT_NO}' and BL_NO = '${BL_NO}'`,
      )
      .then(r => r.length > 0)
      .then(has => {
        if (has) {
          return this.db.update(
            {
              columns: body,
              where: {
                OUTLOT_NO,
                BL_NO,
              },
            },
            userID,
          );
        } else {
          return this.db.insert(body, userID);
        }
      });
  }

  @CacheResult()
  getDeclarations(query) {
    let { type, eta_range } = query;
    eta_range = eta_range || '';
    const eta_range_arr = eta_range.split(',');
    const eta_range_f = toStoreDate(eta_range_arr[0], 'yyyymmdd', 'YYYYMMDD');
    const eta_range_t = toStoreDate(eta_range_arr[1], 'yyyymmdd', 'YYYYMMDD');
    type = toStoreString(type);
    const sql = `select * from ${
      CustomListObject.tableName
      } where (${type} is null or CUSTOMS_TYPE = ${type})
  and (${eta_range_f} is null or trunc(ETA_RQ) >= ${eta_range_f})
  and (${eta_range_t} is null or trunc(ETA_RQ) <= ${eta_range_t})
  `;
    return this.db.search(sql);
  }

  updateWarehouseDate(body, userID) {
    const { ID, OLD_LOT_NO, RECEIVED_DATE } = body;

    const a = this.dateDb.execute(
      `BEGIN
        MHUB_POST_XLOT_TOERP_PRO('${OLD_LOT_NO}','${RECEIVED_DATE}');
       END;`);

    if (ID > 0) {
      return this.dateDb.update(
        {
          columns: body,
          where: {
            ID,
          },
        },
        userID,
      );
    } else {
      return this.dateDb.insert(body, userID);
    }
  }
  async afterUpdateWarehouseDateWithError(out_lot) {
    // tslint:disable-next-line:no-console
    // console.log('邮件开始');
    // this.emailService.sendMail({
    //   from: 'IHUB_System@mic.com.tw', // 发件地址
    //   to: 'gary.h@mic.com.tw',
    //   subject: '收料更新开始', // 标题
    //   html: `<h1>${out_lot}</h1>`,
    // });
    const res = await this.databaseService.search(`select lot_no as out_lot_no,
    (select old_lot_no from mhub_asn_mst c where c.lot_no = a.lot_no) as in_lot_no,
    remark,
    process_method,
    buyer_empno,
    (select nick_name from moa_gl_users b where b.empno = a.buyer_empno) buyer
from MHUB_CLOSE_ERROR_REMARK a where a.lot_no = '${out_lot}'
    `);
    if (res.length === 0) {
      return this.emailService.sendMail({
        from: 'IHUB_System@mic.com.tw', // 发件地址
        to: 'gary.h@mic.com.tw',
        subject: '收料邮件异常', // 标题
        html: `<h1>无数据${out_lot}</h1>`,
      });
    }
    let mailTos = await this.emailService.getMail([
      res[0].BUYER_EMPNO,
      'helen.cao@mic.com.tw',
    ]);
    mailTos = mailTos.filter(_ => _ && _.indexOf('@mic.com.tw') > -1);
    // tslint:disable-next-line:max-line-length
    const cc =
      'guoqiang.fan@mic.com.tw;MSL-SBU-PMC@mic.com.tw;storm.y@mic.com.tw;qh.chen@mic.com.tw;SBU_MC_MSL@mic.com.tw;jianshe.h@mic.com.tw;xiaomin.zhou@mic.com.tw;Jully.Luo@mic.com.tw;MSL_SBU_PD@mic.com.tw;gary.h@mic.com.tw';
    const title = `${res[0].IN_LOT_NO}已做收貨的異常原因維護！`;
    // tslint:disable-next-line:no-console
    // console.log('邮件内容渲染前');
    this.renderService
      .render(resolve(__dirname, '../../../views/close-error-remark.ejs'), {
        list: res,
        title,
      })
      .then(html => {
        // tslint:disable-next-line:no-console
        // console.log('邮件内容渲染后');
        this.emailService.sendMail({
          from: 'IHUB_System@mic.com.tw', // 发件地址
          to: mailTos.join(';'), // 收件列表
          // to: 'gary.h@mic.com.tw',
          subject: title, // 标题
          html,
          cc,
        });
        // this.emailService.dbSendMail({
        //   from: 'IHUB_System@mic.com.tw', // 发件地址
        //   to: mailTos.join(';'), // 收件列表
        //   // to: 'gary.h@mic.com.tw',
        //   subject: title, // 标题
        //   html,
        //   cc,
        // });
      })
      .catch(err => {
        this.emailService.sendMail({
          from: 'IHUB_System@mic.com.tw', // 发件地址
          // to: mailTos.join(';'), // 收件列表
          to: 'gary.h@mic.com.tw',
          subject: title, // 标题
          html: `${err.message} 渲染报错`,
          // cc,
        });
      });
  }
  updateWarehouseDateWithError(body, userID) {
    const { ID, LOT_NO } = body;
    if (ID > 0) {
      return this.errorDB
        .update(
          {
            columns: body,
            where: {
              ID,
            },
          },
          userID,
        )
        .then(() => {
          this.afterUpdateWarehouseDateWithError(LOT_NO);
        });
    } else {
      return this.errorDB.insert(body, userID).then(() => {
        this.afterUpdateWarehouseDateWithError(LOT_NO);
      });
    }
  }

  @CacheResult()
  async getWarehouseDateWithError({
    in_lot,
    re_date,
    out_lot,
    hawb,
    pk_no,
    buyer,
    isClosed,
  }) {
    re_date = re_date || '';
    // if (!re_date) {
    //   return [];
    // }
    in_lot = toStoreString(in_lot);
    out_lot = toStoreString(out_lot);
    buyer = toStoreString(buyer);
    hawb = toStoreString(hawb);
    pk_no = toStoreString(pk_no);
    const _re_date_arr = re_date.split(',');
    const _re_date_f = toStoreDate(_re_date_arr[0], 'yyyymmdd', 'YYYYMMDD');
    const _re_date_t = toStoreDate(_re_date_arr[1], 'yyyymmdd', 'YYYYMMDD');
    const ls = await this.databaseService.search(
      `
      select g.* from (
           select distinct f.*, NVL((select pk_status from mhub_asn_mst where lot_no = in_lot_no and rownum = 1),'N/A') pk_status,
        NVL((select vendor_name from mhub_asn_mst where lot_no = in_lot_no and rownum = 1),'N/A') vendor_name1,
        (select ASN_NO from mhub_asn_mst_out where CONTACT_CODE =
          f.OUT_LOT_NO and rownum = 1) as ASN_NO
        from (select a.*
         from mhub_received_wh_date a, MHUB_INV_DTL inv,MHUB_buyer_info c
      where INV.PART_NO=C.PART_NO(+)
      and a.in_lot_no = INV.lot_no(+)
      and (${buyer} is null or c.BUYER_EMPNO = ${buyer})
      and (${_re_date_f} is null or trunc(a.RECEIVED_DATE) >= ${_re_date_f})
      and (${_re_date_t} is null or trunc(a.RECEIVED_DATE) <= ${_re_date_t})
      and (${pk_no} is null or a.pk_no = ${pk_no})
      and (${hawb} is null or a.hawb = ${hawb})
      and (${in_lot} is null or a.in_lot_no = ${in_lot})
      and (${out_lot} is null or a.out_lot_no = ${out_lot})
      ${
      isClosed !== ''
        ? `and exists (select 1 from mhub_asn_mst  where pk_kind='0' and
          lot_no = a.in_lot_no and
          pk_status ${isClosed > 0 ? `='C'` : `<>'C'`})`
        : ''
      }) f) g`,
      { cacheTime: 1000 * 20 },
    );
    const rq = [];
    const allError = await this.databaseService
      .search(`select LOT_NO, ID as error_id, REMARK, BUYER,STATUS,END_TIME
    ,PROCESS_METHOD, BUYER_EMPNO from ${CloseErrorRemarkObject.tableName}`);
    ls.reduce((a, b) => {
      if (b.ASN_NO) {
        a.push(
          this.databaseService
            .search(
              `
              SELECT A1.ENABLE_BILL_ID, A1.CODE, A1.STATUS, A2.ID, A2.OPERATING_TIME
  FROM IMS_INTERFACE_MST@DBLINK_IMS A1, SYS_BILL@DBLINK_IMS A2
 WHERE A1.ENABLE_BILL_ID = A2.ID
   AND A1.STATUS = 3
 START WITH A1.CODE = '${b.ASN_NO}'
CONNECT BY PRIOR A1.ID = A1.PARENT_ID
 ORDER BY A2.OPERATING_TIME`,
              { isBusy: true, cacheTime: 1000 * 60 * 30 },
            )
            .then(ls1 => {
              if (ls1.length > 0) {
                b.AA_DATE = ls1[0].OPERATING_TIME;
              } else {
                b.AA_DATE = b.RECEIVED_DATE;
              }
            }),
        );
      }
      a.push(
        this.databaseService
          .execute(
            `select BUYER_NAME from mhub_po_mst d where exists (select 1 from mhub_inv_dtl e where d.PO_NO = e.po_no and e.lot_no = '${
            b.OUT_LOT_NO
            }')
                and rownum = 1`,
            undefined,
            undefined,
            { isBusy: true, cacheTime: 1000 * 60 * 30 },
          )
          .then(r1 => {
            const res = r1.rows;
            if (res.length > 0) {
              b.PO_BUYER_NAME = res[0].BUYER_NAME.split(',')[0];
            } else {
              b.PO_BUYER_NAME = '';
            }
            if (!b.BUYER_NAME) {
              b.BUYER_NAME = b.PO_BUYER_NAME;
            }
          }),
      );
      return a;
    }, rq);

    await Promise.all(rq);

    return ls
      .map(l => {
        const tarErr = allError.find(_ => _.LOT_NO === l.OUT_LOT_NO) || {
          ERROR_ID: '',
          REMARK: '',
          BUYER: '',
          STATUS: '',
          END_TIME: '',
        };
        Object.assign(l, tarErr);
        l.msl_pk_status = l.PK_STATUS;
        if (l.PROCESS_FLAG === '1') {
          l.msl_pk_status = 'MSL ERP已驗收，但MIC ERP未驗收';
        }
        l.AA_DATE = l.AA_DATE || l.RECEIVED_DATE;
        return l;
      })
      .sort((a, b) => sortUtils.byCharCode(b.IN_LOT_NO, a.IN_LOT_NO));
  }

  @CacheResult()
  getWarehouseDate({ in_lot, re_date, out_lot }) {
    re_date = re_date || '';
    if (!re_date) {
      return [];
    }
    in_lot = toStoreString(in_lot);
    out_lot = toStoreString(out_lot);
    const _re_date_arr = re_date.split(',');
    const _re_date_f = toStoreDate(_re_date_arr[0], 'yyyymmdd', 'YYYYMMDD');
    const _re_date_t = toStoreDate(_re_date_arr[1], 'yyyymmdd', 'YYYYMMDD');
    return this.dateDb.search(
      `select * from ${ReceivedWhDateObject.tableName}
      where (${_re_date_f} is null or trunc(RECEIVED_DATE) >= ${_re_date_f})
      and (${_re_date_t} is null or trunc(RECEIVED_DATE) <= ${_re_date_t})
      and (${in_lot} is null or in_lot_no = ${in_lot})
      and (${out_lot} is null or out_lot_no = ${out_lot})`,
    );
  }

  @CacheResult()
  getAsnForWarehouseDate({ in_lot, rq_date, out_lot }) {
    rq_date = rq_date || '';
    if (!rq_date) {
      return [];
    }
    const v_in_lot = toStoreString(in_lot);
    out_lot = toStoreString(out_lot);
    const _rq_date_arr = rq_date.split(',');
    const _rq_date_f = toStoreDate(_rq_date_arr[0], 'yyyymmdd', 'YYYYMMDD');
    const _rq_date_t = toStoreDate(_rq_date_arr[1], 'yyyymmdd', 'YYYYMMDD');
    const out_lot_sql = `Select a.rowid,a.old_lot_no,a.lot_no,a.ship_via,a.MHK_ETA,
    a.TOTAL_PALLET,a.TOTAL_CARTON,a.CUSTOMER_CODE,a.pk_status ,a.BUYER_COMPANY
    From mhub_asn_mst a Where a.buyer_company<>'99999'
    and (a.MHK_ETA is null or (
    (${_rq_date_f} is null or trunc(a.MHK_ETA) >= ${_rq_date_f})
    and (${_rq_date_t} is null or trunc(a.MHK_ETA) <= ${_rq_date_t})))
    and not exists ( select in_lot_no from
    mhub_received_wh_date b where b.customer_code=a.customer_code and b.out_lot_no=a.lot_no )
    and (${v_in_lot} is null or a.old_lot_no = ${v_in_lot})
    and (${out_lot} is null or a.lot_no = ${out_lot})
    and  customer_code='00003'
    and a.pk_kind='2'
    `;
    if (in_lot) {
      return this.db
        .search(
          `select 1 from mhub_asn_mst where
      lot_no=${v_in_lot}  and  customer_code='00003' and pk_kind = '0'`,
        )
        .then(r => {
          if (r.length > 0) {
            return this.db.search(
              `Select rowid,old_lot_no,lot_no,ship_via,MHK_ETA,TOTAL_PALLET,TOTAL_CARTON,CUSTOMER_CODE,
          pk_status ,BUYER_COMPANY  From mhub_asn_mst b Where customer_code='00003' and old_lot_no=${v_in_lot} and pk_kind='2'
          and not exists ( select in_lot_no from mhub_received_wh_date where customer_code='00003' and out_lot_no=b.lot_no )
          order by old_lot_no `,
            );
          } else {
            return this.db.search(out_lot_sql);
          }
        });
    } else {
      return this.db.search(out_lot_sql);
    }
  }

  @CacheResult()
  getDeclarationDetail({ onboard_date, bl_no, ship_via }) {
    if (!ship_via) {
      return [];
    }
    onboard_date = onboard_date || '';
    const _re_date_arr = onboard_date.split(',');
    const _re_date_f = toStoreDate(_re_date_arr[0], 'yyyymmdd', 'YYYYMMDD');
    const _re_date_t = toStoreDate(_re_date_arr[1], 'yyyymmdd', 'YYYYMMDD');
    bl_no = toStoreString(bl_no);
    if (ship_via === 'SEA') {
      const sql = `select * from
      ( select NOTIFY_PHONE,ONBOARD_DATE,buyer_company,mawb,ship_via,ONBOARD_DATE as  hk,(ONBOARD_DATE+1) as  bj,container_no,
      LOT_NO from mhub_bl_mst
      where (${bl_no} is null or mawb=${bl_no})) a where
      not exists (select  bl_no from mhub_custom_list b where b.bl_no=a.mawb and  b.bl_no is not null and b.customs_time is not null )
      and (${_re_date_f} is null or trunc(a.ONBOARD_DATE) >= ${_re_date_f})
    and (${_re_date_t} is null or trunc(a.ONBOARD_DATE) <= ${_re_date_t})
      `;
      return this.db.search(sql).then((ls: any[]) => {
        const nLs = [];
        const rq = [];
        ls.reduce((a, b) => {
          if (b.LOT_NO) {
            const lotList = Array.from(new Set(b.LOT_NO.split(','))).map(
              (s: string) => s.trim(),
            );
            lotList.forEach(l => {
              const sql2 = `SELECT V.NET_WEIGHT AS C_N_WEIGHT,
                V.RECEIVED_QTY,
                V.AMOUNT,
                V.PART_NO,
                V.ORIGIN_COUNTRY,
                V.PART_DESC,
                V.OLD_LOT_NO,
                DECODE (V.ROWNO, 1, V.TOTAL_CARTON, 0) AS TOTAL_CARTON,
                DECODE (V.ROWNO, 1, V.TT_GROSS_WEIGHT, 0) AS TOTAL_GROSS_WEIGHT,
                V.LOT_NO,
                (select EMS_NO from mhub_BND_EBPT_INTERFACE where dept_part= V.PART_NO
                and ems_no='E51508000003' and rownum = 1) EMS_NO,
                (select attribute3 from mhub_BND_EBPT_INTERFACE where dept_part= v.PART_NO
                  and ems_no='E51508000003' and rownum = 1) xu_hao,
                (select eptg_desc from mhub_BND_EBPT_INTERFACE where dept_part= v.PART_NO
                    and ems_no='E51508000003' and rownum = 1) EPTG_DESC
           FROM (SELECT ROWNUM AS ROWNO,
                        A.NET_WEIGHT,
                        C.PART_NO,
                        C.ORIGIN_COUNTRY,
                        C.RECEIVED_QTY,
                        C.AMOUNT,
                        C.PART_DESC,
                        D.OLD_LOT_NO,
                        D.TOTAL_CARTON,
                        A.GROSS_WEIGHT,
                        D.LOT_NO,
                        (SELECT SUM (TOTAL_C_G_WEIGHT)
                           FROM MHUB_PACKLIST
                          WHERE LOT_NO = A.LOT_NO)
                           AS TT_GROSS_WEIGHT
                   FROM (  SELECT CUSTOMER_COMPANY,
                                  BUYER_COMPANY,
                                  SELLER_COMPANY,
                                  ORIGIN_COUNTRY,
                                  LOT_NO,
                                  PART_NO,
                                  SUM (TOTAL_C_N_WEIGHT) AS NET_WEIGHT,
                                  SUM (TOTAL_C_G_WEIGHT) AS GROSS_WEIGHT
                             FROM MHUB_PACKLIST
                         GROUP BY CUSTOMER_COMPANY,
                                  BUYER_COMPANY,
                                  SELLER_COMPANY,
                                  ORIGIN_COUNTRY,
                                  LOT_NO,
                                  PART_NO) A,
                        MHUB_INVOICE_LIST C,
                        MHUB_ASN_MST D
                  WHERE     A.LOT_NO = C.LOT_NO
                        AND A.LOT_NO = D.LOT_NO
                        AND A.PART_NO = C.PART_NO
                        AND D.OLD_LOT_NO = '${l}'
                        AND A.ORIGIN_COUNTRY = C.ORIGIN_COUNTRY) V`;
              rq.push(
                this.db.search(sql2).then(r1 => {
                  r1.forEach(_ => {
                    nLs.push(Object.assign({}, b, _));
                  });
                }),
              );
            });
          }
          return rq;
        }, rq);

        return Promise.all(rq).then(() => {
          return nLs;
        });
      });
    } else {
      return this.db.search(
        `select a.MHK_ETA as ONBOARD_DATE,a.old_lot_no ,a.mawb,a.lot_no,b.part_no,b.po_no,sum(RECEIVED_QTY) as RECEIVED_QTY,
          (select EMS_NO from mhub_BND_EBPT_INTERFACE where dept_part= b.PART_NO
            and ems_no='E51508000003' and rownum = 1) EMS_NO , (select attribute3 from mhub_BND_EBPT_INTERFACE where dept_part= b.PART_NO
            and ems_no='E51508000003' and rownum = 1) xu_hao, (select eptg_desc from mhub_BND_EBPT_INTERFACE where dept_part= b.PART_NO
              and ems_no='E51508000003' and rownum = 1) EPTG_DESC from
      ( select pk_status,doc_date,customer_code,MHK_ETA,buyer_company,old_lot_no,pk_kind,lot_no,MHK_ETA  as hk,MHK_ETA  as bj,
         MAWB, HAWB, TRANS_NO,ship_via,WAREHOUSE_CODE  as container_no  from mhub_asn_mst ) a ,mhub_inv_dtl b where
       not exists (select  bl_no from mhub_custom_list c  where c.bl_no=a.mawb and c.LOT_NO=a.old_lot_no
       and  c.bl_no is not null and c.customs_time is not null )
       and (${_re_date_f} is null or trunc(a.MHK_ETA) >= ${_re_date_f})
       and (${_re_date_t} is null or trunc(a.MHK_ETA) <= ${_re_date_t})
       and a.ship_via = '${ship_via}'
       and  a.lot_no=b.lot_no(+) and a.customer_code='00003' group by  a.MHK_ETA,a.old_lot_no , a.mawb,a.lot_no,b.part_no,b.po_no`,
      );
    }
  }

  async getItemForMaintainence({ lot_no, pk_status }) {
    lot_no = toStoreString(lot_no);
    pk_status = toStoreString(pk_status);
    return this.databaseService
      .search(`select distinct a.lot_no,b.pk_status, part_no, part_desc
    from Mhub_asn_dtl a, mhub_asn_mst b
   where a.lot_no = b.lot_no
     and (${pk_status} is null or b.pk_status = ${pk_status})
     and b.PK_kind = '0'
     and (${lot_no} is null or a.lot_no = ${lot_no})
     and not exists (select 1
      from MHUB_BND_EBPT_INTERFACE c
      where c.dept_part = a.part_no) and part_no not like '528%' and part_no not like 'IHVP%' order by pk_status`);
  }
}
