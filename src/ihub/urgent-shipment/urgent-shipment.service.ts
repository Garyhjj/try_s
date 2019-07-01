import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import {
  UrgentShipmentEntity,
  UrgentShipmentObject,
} from './urgent-shipment.dto';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { toStoreString, toStoreDate } from '../../shared/tables';
import { CacheResult } from '../../shared/decorators';

@Injectable()
export class UrgentShipmentService {
  db: DatabaseTable;
  constructor(private databaseService: DatabaseService) {
    this.db = this.databaseService.getTableInstance(
      UrgentShipmentObject,
      UrgentShipmentEntity,
    );
  }

  @CacheResult()
  getMyUrgent(filter) {
    let { user_code } = filter;
    user_code = toStoreString(user_code);
    return this.db.search(
      `select doc_date,lot_no,ship_via,inrq_date,URGENT_STATE_CODE,ID,inmsl_date,process_flag, DOC_DATE,ATTRIBUTE6,
        (select VENDOR_SO from mhub_label c where STATUS<>'2' and lot_no= a.lot_no) label
    from mhub_urgent_shipment a where a.user_code=${user_code}
    and exists (select lot_no from mhub_asn_mst b where customer_code='00003'
    and pk_status<>'C' and pk_kind='0' and a.lot_no=b.lot_no  )`,
    );
  }

  @CacheResult()
  getDetailUrgent(filter) {
    let {
      lot_no,
      user_code,
      create_date,
      u_state,
      msl_date,
      process_flag,
      goods_status,
      isOpen,
    } = filter;
    goods_status = goods_status || '';
    isOpen = isOpen || '';
    lot_no = lot_no || '';
    lot_no = lot_no.toLocaleUpperCase();
    lot_no = toStoreString(lot_no);
    user_code = toStoreString(user_code);
    process_flag = toStoreString(process_flag);
    create_date = create_date || '';
    const create_date_arr = create_date.split(',');
    const create_date_f = toStoreDate(
      create_date_arr[0],
      'yyyymmdd',
      'YYYYMMDD',
    );
    const create_date_t = toStoreDate(
      create_date_arr[1],
      'yyyymmdd',
      'YYYYMMDD',
    );
    u_state = u_state || '';
    const u_state_n = u_state
      .split(',')
      .map(u => toStoreString(u))
      .join(',');
    msl_date = msl_date || '';
    const msl_date_arr = msl_date.split(',');
    const msl_date_f = msl_date_arr[0]
      ? toStoreDate(
          moment(msl_date_arr[0], 'YYYYMMDD HH'),
          'yyyymmdd hh24',
          'YYYYMMDD HH',
        )
      : `''`;
    const msl_date_t = msl_date_arr[1]
      ? toStoreDate(
          moment(msl_date_arr[1], 'YYYYMMDD HH'),
          'yyyymmdd hh24',
          'YYYYMMDD HH',
        )
      : `''`;
    return this.db
      .search(
        `select a.*,
        (select VENDOR_SO from mhub_label c where STATUS<>'2' and lot_no= a.lot_no and rownum = 1) label,
        (select CREATION_DATE from mhub_label c where lot_no= a.lot_no and rownum = 1) ATA_CKS,
        (select pk_status from mhub_asn_mst where customer_code='00003' and lot_no= a.lot_no and rownum = 1) pk_status
    from mhub_urgent_shipment a where (${user_code} is null or a.user_code=${user_code})
    and (${lot_no} is null or a.lot_no = ${lot_no})
    and (${create_date_f} is null or trunc(a.DOC_DATE) >= ${create_date_f})
    and (${create_date_t} is null or trunc(a.DOC_DATE) < ${create_date_t} + 1)
    and (${msl_date_f} is null or trunc(a.INMSL_DATE) >= ${msl_date_f})
    and (${msl_date_t} is null or trunc(a.INMSL_DATE) <= ${msl_date_t})
    and ('${u_state}' is null or a.URGENT_STATE_CODE in (${u_state_n}))
    and (${process_flag} is null or a.process_flag = ${process_flag})
    and ('${goods_status}' is null or (${
          goods_status === '1' ? '' : 'not'
        } exists (select 1
      from mhub_asn_mst c
      where c.customer_code='00003' and c.pk_kind='2' and c.pk_status in ('9','C')
    and c.ship_via=a.ship_via and a.lot_no=c.old_lot_no )))
    and ('${isOpen}' is null or ( ${
          isOpen === 'Y' ? '' : 'not'
        } EXISTS (SELECT DISTINCT d.old_lot_no FROM mhub_asn_mst d
      WHERE d.customer_code='00003' AND d.pk_kind='0' AND d.pk_status <>'C' AND a.lot_no=d.old_lot_no )))
    and m_type is null order by URGENT_STATE_CODE desc
   `,
      )
      .then(ls => {
        if (ls.length > 0) {
          const req = [];
          ls.forEach(l => {
            l.PK_STATUS = l.PK_STATUS || 'Delete';
            req.push(
              this.db
                .search(
                  `select lot_no,
            decode(ship_via,'SEA',to_date(MHK_ETA,'yyyymmddhh24miss')+1,to_date(MHK_ETA,'yyyymmddhh24miss')) as eta_rq,
            to_date(MHK_ETD,'yyyymmddhh24miss')as MHK_ETD ,
             round((to_date(RECEIVED_DATE,'yyyymmddhh24miss')-to_date(MHK_ETD,'yyyymmddhh24miss'))*24,2) as total_hour1,
              to_date(RECEIVED_DATE,'yyyymmddhh24miss') as RECEIVED_DATE
               from mhub_asn_mst where pk_kind='2' and old_lot_no='${
                 l.LOT_NO
               }' and ship_via='l.SHIP_VIA'`,
                )
                .then(mst => {
                  if (mst.length > 0) {
                    const m = mst[0];
                    l.ETD_HK_DATE = m.MHK_ETD; // 離香港
                    l.ATA_RQ = m.ATA_RQ;
                    l.WH_RECEIVE_DATE = m.WH_RECEIVE_DATE; // 進倉庫
                    l.TOTAL_HOUR1 = m.TOTAL_HOUR1;
                  } else {
                    l.ETD_HK_DATE = '';
                    l.ATA_RQ = '';
                    l.WH_RECEIVE_DATE = '';
                    l.TOTAL_HOUR1 = '';
                  }
                  l.TOTAL_HOUR2 = ''; // 領用時間
                  if (l.OUT_WAREHOUSE_DATE && l.WH_RECEIVE_DATE) {
                    const m1 = moment(l.OUT_WAREHOUSE_DATE);
                    const m2 = moment(l.WH_RECEIVE_DATE);
                    if (m1.isValid() && m2.isValid()) {
                      l.TOTAL_HOUR2 = (
                        (m1.toDate().getTime() - m2.toDate().getTime()) /
                        (1000 * 60 * 60)
                      ).toFixed(2);
                    }
                  }
                }),
            );
          });
          return Promise.all(req).then(() => ls);
        } else {
          return [];
        }
      });
  }

  getBU(lot_no) {
    return this.db
      .search(
        `select distinct BU_CODE from mhub_inv_mst where lot_no='${lot_no}' and customer_code='00003'`,
      )
      .then(ls => ls.map(l => l.BU_CODE).join(','));
  }

  getExistsByLotNO(lot_no) {
    return this.db
      .search(
        `select (select nick_name from moa_gl_users where empno = a.USER_CODE)
       user_name from mhub_urgent_shipment a where lot_no = '${lot_no}'`,
      )
      .then(ls => {
        if (ls.length > 0) {
          return ls[0].USER_NAME || '系统';
        } else {
          return null;
        }
      });
  }

  insertUrgent(body, userID = -1) {
    body.INMSL_DATE = moment(body.INMSL_DATE, 'YYYY-MM-DD HH').format(
      'YYYY-MM-DD HH:mm:ss',
    );
    body.DOC_DATE = moment(body.DOC_DATE).format('YYYY-MM-DD HH:mm:ss');
    body.PROCESS_FLAG = '1';
    const { LOT_NO } = body;
    return this.getExistsByLotNO(LOT_NO)
      .then(user_name => {
        if (user_name) {
          return Promise.reject(`此筆 Lot No 已被${user_name}维护成急料 !!`);
        } else {
          return this.getBU(LOT_NO);
        }
      })
      .then(bu_code => {
        body.ORG_CODE = bu_code;
        return this.db.insert(body, userID).then(res => {
          return this.db
            .execute(
              `update mhub_asn_mst set is_urgent= 'Y' where lot_no = '${LOT_NO}' and pk_kind = '0'`,
            )
            .then(() =>
              this.db.execute(`update MHUB_ASN_MST
            set IS_CREATED_SO = 'W'
          where LOT_NO = '${LOT_NO}' and (IS_CREATED_SO is null or IS_CREATED_SO = 'N')`),
            )
            .then(() => res);
        });
      });
  }

  async updateUrgent(body, userID = -1) {
    const res = await this.db.update(body, (userID = -1));
    const target = body.columns;
    const { LOT_NO } = target;
    if (target.hasOwnProperty('PROCESS_FLAG')) {
      const flag = target.PROCESS_FLAG;
      await this.db.execute(
        `update mhub_asn_mst set is_urgent= '${
          flag === '1' ? 'Y' : flag === '2' ? 'N' : ''
        }' where lot_no = '${LOT_NO}' and pk_kind = '0'`,
      );
      if (flag === '1') {
        await this.db.execute(`update MHUB_ASN_MST
          set IS_CREATED_SO = 'W'
        where LOT_NO = '${LOT_NO}' and (IS_CREATED_SO is null or IS_CREATED_SO = 'N')`);
      } else {
        await this.db.execute(`update MHUB_ASN_MST
        set IS_CREATED_SO = ''
          where LOT_NO = '${LOT_NO}' and IS_CREATED_SO = 'W'`);
      }
    }
    return res;
  }
}
