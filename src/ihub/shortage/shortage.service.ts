import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { toStoreString, toStoreDate } from '../../shared/tables';
import { UtilService } from './../../core/util.service';
import { Injectable } from '@nestjs/common';
import { ShortageEntity, ShortageObject } from './shortage.dto';
import { CacheResult } from '../../shared/decorators';

@Injectable()
export class ShortageService {
  db: DatabaseTable;
  HOLD_TABLE = 'MHUB_HOLD_COMPARE_MST';
  constructor(
    private util: UtilService,
    private databaseService: DatabaseService,
  ) {
    this.db = this.databaseService.getTableInstance(
      ShortageObject,
      ShortageEntity,
    );
  }

  @CacheResult()
  getAsn({ in_lot_no, out_lot_no, part_no }) {
    in_lot_no = toStoreString(this.util.upperCase(in_lot_no));
    out_lot_no = toStoreString(this.util.upperCase(out_lot_no));
    part_no = toStoreString(this.util.upperCase(part_no));
    return this.db.search(
      `Select * from mhub_ASN_MST a Where PK_KIND='2'
    and (${in_lot_no} is null or old_Lot_No = ${in_lot_no})
    and (${out_lot_no} is null or Lot_No = ${out_lot_no})
    and (${part_no} is null or ${part_no} in (select part_no from mhub_ASN_DTL b where b.lot_no=a.old_Lot_No))`,
    );
  }

  @CacheResult()
  getParts(in_lot_no) {
    in_lot_no = toStoreString(this.util.upperCase(in_lot_no));
    return this.db.search(
      `select a.BUYER_COMPANY ,a.SELLER_COMPANY,a.PK_NO,
        a.LOT_NO,c.pk_status ,b.customer_code,b.PO_NO,b.hi_no,
        b.part_no,b.PO_SNO,b.part_desc,b.VENDOR_CODE,b.VENDOR_CODE,b.UNIT_PRICE ,b.BU_CODE,
        B.RECEIVED_QTY
        from mhub_INV_MST a,mhub_INV_DTL b,mhub_asn_mst c
        where  a.lot_no=c.lot_no
        and a.lot_no=b.lot_no
        and (${in_lot_no} is null or a.Lot_No = ${in_lot_no})
        and a.inv_no=b.inv_no order by part_no`,
    );
  }

  insertShortage(body, userID = -1) {
    body.columns = this.shortageDateFormat(body.columns);
    return this.db.insert(body, userID);
  }

  updateShortage(body, userID = -1) {
    body.columns = this.shortageDateFormat(body.columns);
    return this.db.update(body, (userID = -1));
  }

  shortageDateFormat(body) {
    const b = { ...body };
    if (b.hasOwnProperty('ATA_MSL')) {
      b.ATA_MSL = this.util.dateFormat(b.ATA_MSL, 'YYYY-MM-DD HH:mm:ss');
    }
    if (b.hasOwnProperty('B_OK_DATE')) {
      b.B_OK_DATE = this.util.dateFormat(b.B_OK_DATE, 'YYYY-MM-DD HH:mm:ss');
    }
    return b;
  }

  @CacheResult()
  getShortage(filter) {
    return this.db.find(filter, 1, 1000).then(res => res.rows);
  }

  @CacheResult()
  getShortageDetail({ buyer_no, seller_no, lot_no, part_no, ata_msl_range }) {
    buyer_no = toStoreString(buyer_no);
    seller_no = toStoreString(seller_no);
    lot_no = toStoreString(this.util.upperCase(lot_no));
    part_no = toStoreString(this.util.upperCase(part_no));
    ata_msl_range = ata_msl_range || '';
    const ata_msl_arr = ata_msl_range.split(',');
    const ata_msl_f = toStoreDate(ata_msl_arr[0], 'yyyymmdd', 'YYYYMMDD');
    const ata_msl_t = toStoreDate(ata_msl_arr[1], 'yyyymmdd', 'YYYYMMDD');
    return this.db.search(
      `select a.*,
    (select nvl(vendor_name,'N/A') vendor_name from mhub_asn_mst where vendor_code= a.vender and rownum = 1) as vendor_name
    from mhub_shortage a where
    (${buyer_no} is null or buyer_company = ${buyer_no})
    and (${seller_no} is null or seller_company = ${seller_no})
    and (${lot_no} is null or lot_no = ${lot_no})
    and (${part_no} is null or part_no = ${part_no})
    and (${ata_msl_f} is null or trunc(ata_msl) >= ${ata_msl_f})
    and (${ata_msl_t} is null or trunc(ata_msl) <= ${ata_msl_t})
    `,
    );
  }

  deleteShortage(id) {
    return this.db.deleteById(id);
  }

  @CacheResult()
  getHoldCompare() {
    const HOLD_TABLE = this.HOLD_TABLE;
    return this.db.search(`select * from ${HOLD_TABLE}`);
  }

  updateHoldCompare(body, userID = -1) {
    const HOLD_TABLE = this.HOLD_TABLE;
    let { DATE_FROM, DATE_TO } = body;
    const { PART_NO, DEMAND_QTY, MC_NAME } = body;
    DATE_FROM = this.util.dateFormat(DATE_FROM, 'YYYYMMDD');
    DATE_TO = this.util.dateFormat(DATE_TO, 'YYYYMMDD');
    return this.db
      .execute(
        `insert into MHUB_HOLD_COMPARE_MST_back  select * from ${HOLD_TABLE}`,
      )
      .then(r =>
        this.db.execute(`delete ${HOLD_TABLE}
    where date_from <>to_date('${DATE_FROM}','yyyymmdd')`),
      )
      .then(r =>
        this.db
          .execute(
            `select part_NO from ${HOLD_TABLE}
    where part_NO='${PART_NO}'
    and date_from =to_date('${DATE_FROM}','yyyymmdd')
    and date_to =to_date('${DATE_TO}','yyyymmdd')`,
          )
          .then(r1 => r1.rows.length)
          .then(lg => {
            if (lg > 0) {
              return this.db
                .execute(`update ${HOLD_TABLE} set demand_qty='${DEMAND_QTY}',
        last_update_date=sysdate, last_updated_by = ${userID}
        where  part_NO='${PART_NO}' and date_from =to_date('${DATE_FROM}','yyyymmdd')
        and date_to =to_date('${DATE_TO}','yyyymmdd')`);
            } else {
              return this.db.execute(`insert INTO ${HOLD_TABLE}
        (PART_NO,DEMAND_QTY,MC_NAME ,DATE_TO,DATE_FROM,STATUS,CREATION_DATE ,CREATED_BY )
        VALUES('${PART_NO}','${DEMAND_QTY}','${MC_NAME}',to_date('${DATE_TO}','yyyymmdd') ,
        to_date('${DATE_FROM}','yyyymmdd') ,'Y',SYSDATE,'${userID}' )  `);
            }
          })
          .then(d => 'ok'),
      );
  }
}
