import { sortUtils } from './../../shared/utils/index';
import { isProduction } from './../../config/config';
import { DatabaseService } from './../../core/database.service';
import { AsnDtlService } from './../asn-dtl/asn-dtl.service';
import { AsnMstService } from './../asn-mst/asn-mst.service';
import { Injectable } from '@nestjs/common';
import { toStoreString, getStoreDateRange } from '../../shared/tables';
import { arrayClassifyByOne } from '../../shared/utils';
import { CacheResult } from '../../shared/decorators';

@Injectable()
export class ShippingInstructionService {
  constructor(
    private asnMstService: AsnMstService,
    private asnDtlService: AsnDtlService,
    private databaseService: DatabaseService,
  ) {}

  callForSO(lot: string, isWhole: boolean) {
    this.databaseService.execute(`begin
    mhub_auto_so_pkg.shipping_instruction_so('${lot}','${isWhole ? 'W' : 'P'}');
    end;`);
  }

  @CacheResult()
  getPartWhileWhole(lot_no) {
    return this.databaseService.search(
      `SELECT LOT_NO,VENDOR_CODE,BU_CODE,PART_NO,PART_DESC,SUM(BALANCE_QTY) as b_qty
      FROM mhub_INV_DTL WHERE lot_no='${lot_no}' and customer_code='00003'
      GROUP BY LOT_NO,VENDOR_CODE,BU_CODE,PART_NO,PART_DESC ORDER BY PART_NO,BU_CODE`,
    );
  }

  @CacheResult()
  getPartWhilePartial(lot_no) {
    return this.databaseService.search(
      `select pallet_from,pallet_to,carton_from,carton_to,outbound_remark,out_bu,mc_code,sum(total_qty) as total_qty,
        mhub_getPartNoForPartial_Fnc('${lot_no}',pallet_from,pallet_to,carton_from,carton_to,1) as part_no,
        mhub_getPartNoForPartial_Fnc('${lot_no}',pallet_from,pallet_to,carton_from,carton_to,2) as part_desc,
        mhub_getPartNoForPartial_Fnc('${lot_no}',pallet_from,pallet_to,carton_from,carton_to,3) as dtl_id,
        mhub_getPartNoForPartial_Fnc('${lot_no}',pallet_from,pallet_to,carton_from,carton_to,4) as OUT_SHIP_VIA,
        mhub_getPartNoForPartial_Fnc('${lot_no}',pallet_from,pallet_to,carton_from,carton_to,5) as MHK_ETD,
        mhub_getPartNoForPartial_Fnc('${lot_no}',pallet_from,pallet_to,carton_from,carton_to,6) as OUT_SHIP_REMARK,
        count(distinct part_no) as part_row from Mhub_asn_dtl where lot_no='${lot_no}'
        group by pallet_from,pallet_to,carton_from,carton_to,outbound_remark,out_bu,mc_code
        order by pallet_from,carton_from`,
    );
  }

  async updateInstructionWhileWhole(data, userID = -1) {
    const req = [];
    const lot_no = data.LOT_NO;
    const [dtl, mst] = await Promise.all([
      this.databaseService.search(
        `select * from mhub_asn_dtl where LOT_NO = '${lot_no}'`,
      ),
      this.databaseService
        .search(`select * from mhub_asn_mst where LOT_NO = '${lot_no}'`)
        .then(ls => ls[0]),
    ]);
    const top_ship_via =
      mst.HOLD_FLAG === 'B'
        ? 'HOLD IN HUB'
        : mst.HOLD_FLAG === 'H'
          ? 'HOLD'
          : mst.SHIP_VIA;
    req.push(
      this.asnMstService.updateMst(
        {
          columns: {
            OUT_SHIP_VIA: data.OUT_SHIP_VIA,
            MHK_ETD: data.MHK_ETD,
            OUTBOUND_TYPE: data.OUTBOUND_TYPE,
            OUTBOUND_REMARK: data.OUTBOUND_REMARK,
            MC_CODE: data.MC_CODE,
            OUT_SHIP_REMARK: data.OUT_SHIP_REMARK,
            IS_CREATED_SO: 'S',
            PK_STATUS: '2',
          },
          where: { LOT_NO: lot_no, CUSTOMER_CODE: '00003', PK_KIND: '0' },
        },
        userID,
      ),
    );
    dtl.forEach(d => {
      const old_ship_via = d.LAST_SHIP_VIA || top_ship_via;
      req.push(
        this.asnDtlService.updateDtl(
          {
            columns: {
              OUT_SHIP_VIA: data.OUT_SHIP_VIA,
              MHK_ETD: data.MHK_ETD,
              OUTBOUND_REMARK: data.OUTBOUND_REMARK,
              MC_CODE: data.MC_CODE,
              IS_CREATED_SO: 'N',
              INSTRUCTION_DATE: new Date(),
              LAST_SHIP_VIA: old_ship_via,
              OUT_SHIP_REMARK: data.OUT_SHIP_REMARK,
            },
            where: { ID: d.ID },
          },
          userID,
        ),
      );
    });
    return Promise.all(req).then(d => {
      this.callForSO(lot_no, true);
      this.afterFinishPartial(lot_no);
      return d;
    });
  }

  async deleteInstruction(query, userID = -1) {
    const { lot_no, remark } = query;
    let dtl = await this.databaseService.search(
      `select * from mhub_asn_dtl where LOT_NO = '${lot_no}'`,
    );
    if (remark) {
      dtl = dtl.filter(_ => +_.OUTBOUND_REMARK === +remark);
    }
    return Promise.all(
      dtl.map(d => {
        const ID = d.ID,
          req = [];
        //  删掉对应的outbound资料
        req.push(
          this.databaseService
            .execute(`delete from mhub_asn_mst where pk_kind = '2'
         and lot_no = (select lot_no from mhub_asn_dtl where PARENT_DTL_ID = ${ID})`),
        );
        req.push(
          this.asnDtlService.updateDtl(
            {
              columns: {
                OUT_SHIP_VIA: '',
                MHK_ETD: '',
                OUTBOUND_REMARK: '',
                MC_CODE: '',
                IS_CREATED_SO: 'N',
                LAST_SHIP_VIA: d.OUT_SHIP_VIA,
              },
              where: { ID },
            },
            userID,
          ),
        );
        return Promise.all(req);
      }),
    )
      .then(() =>
        this.databaseService.search(
          `select OUTBOUND_REMARK  from mhub_asn_dtl where lot_no = '${lot_no}'`,
        ),
      )
      .then((all: any[]) => {
        const has = all.find(a => a.OUTBOUND_REMARK);
        const no = all.find(a => !a.OUTBOUND_REMARK);
        if (!has) {
          return this.asnMstService.updateMst(
            {
              columns: {
                OUT_SHIP_VIA: '',
                MHK_ETD: '',
                OUTBOUND_TYPE: '',
                OUTBOUND_REMARK: '',
                MC_CODE: '',
                // IS_CREATED_SO: '',
              },
              where: { LOT_NO: lot_no, CUSTOMER_CODE: '00003' },
            },
            userID,
          );
        } else if (no) {
          return this.asnMstService.updateMst(
            {
              columns: {
                OUTBOUND_TYPE: 'P',
              },
              where: { LOT_NO: lot_no, CUSTOMER_CODE: '00003' },
            },
            userID,
          );
        } else {
          return null;
        }
      });
  }

  async getNextOutboundRemark(lot_no) {
    return this.databaseService
      .search(
        `select max(OUTBOUND_REMARK) n  from mhub_asn_dtl where lot_no = '${lot_no}' and OUTBOUND_REMARK <> '*'`,
      )
      .then(ls => {
        if (ls.length > 0) {
          const l = ls[0].N;
          return !Number.isNaN(+l) ? +l + 1 : 1;
        } else {
          return 1;
        }
      });
  }

  async hasNoInstruction(lot_no) {
    return this.databaseService
      .search(
        `select count(1) n  from mhub_asn_dtl where lot_no = '${lot_no}' and OUTBOUND_REMARK is null`,
      )
      .then(ls => {
        return ls[0].N > 0;
      });
  }
  isHold(data) {
    const o = data.OUT_SHIP_VIA;
    return o === 'HOLD' || o === 'HOLD IN HUB';
  }

  afterFinishPartial(lot_no: string) {
    return this.databaseService.execute(`begin
    MHUB_PARTIAL_MAIL_PRO('${lot_no}');
     end;`);
  }

  async updateInstructionWhilePartial(data, userID = -1) {
    const { dtlIDs, LOT_NO } = data;
    if (Array.isArray(dtlIDs) && dtlIDs.length > 0) {
      const [dtl, mst] = await Promise.all([
        this.databaseService.search(
          `select * from mhub_asn_dtl where LOT_NO = '${LOT_NO}'`,
        ),
        this.databaseService
          .search(`select * from mhub_asn_mst where LOT_NO = '${LOT_NO}'`)
          .then(ls => ls[0]),
      ]);
      const top_ship_via =
        mst.HOLD_FLAG === 'B'
          ? 'HOLD IN HUB'
          : mst.HOLD_FLAG === 'H'
            ? 'HOLD'
            : mst.SHIP_VIA;
      return this.getNextOutboundRemark(LOT_NO)
        .then(id => {
          const r = [];
          const ids = this.isHold(data) ? '*' : id;
          dtlIDs.forEach(i => {
            const oldData = dtl.find(_ => _.ID === +i);
            const old_ship_via = oldData.LAST_SHIP_VIA || top_ship_via;
            //  删掉对应的outbound资料
            r.push(
              this.databaseService
                .execute(`delete from mhub_asn_mst where pk_kind = '2'
         and lot_no = (select lot_no from mhub_asn_dtl where PARENT_DTL_ID = ${+i})`),
            );
            r.push(
              this.asnDtlService.updateDtl(
                {
                  columns: {
                    OUT_SHIP_VIA: data.OUT_SHIP_VIA,
                    MHK_ETD: data.MHK_ETD,
                    OUTBOUND_REMARK: ids,
                    MC_CODE: data.MC_CODE,
                    IS_CREATED_SO: 'N',
                    OUT_SHIP_REMARK: data.OUT_SHIP_REMARK,
                    INSTRUCTION_DATE: new Date(),
                    LAST_SHIP_VIA: old_ship_via,
                  },
                  where: { ID: i },
                },
                userID,
              ),
            );
          });
          return Promise.all(r).then(() => id);
        })
        .then(id => {
          if (id > 0) {
            return this.asnMstService
              .updateMst(
                {
                  columns: {
                    OUTBOUND_TYPE: 'P',
                    MC_CODE: data.MC_CODE,
                    // IS_CREATED_SO: '',
                  },
                  where: { LOT_NO, CUSTOMER_CODE: '00003' },
                },
                userID,
              )
              .then(() =>
                this.hasNoInstruction(LOT_NO).then(has => {
                  if (!has) {
                    return this.asnMstService
                      .updateMst(
                        {
                          columns: {
                            OUTBOUND_TYPE: 'PE',
                            MC_CODE: data.MC_CODE,
                            IS_CREATED_SO: 'S',
                            PK_STATUS: '2',
                          },
                          where: {
                            LOT_NO,
                            CUSTOMER_CODE: '00003',
                            PK_KIND: '0',
                          },
                        },
                        userID,
                      )
                      .then(d => {
                        this.callForSO(LOT_NO, false);
                        this.afterFinishPartial(LOT_NO);
                        return d;
                      });
                  } else {
                    return id;
                  }
                }),
              );
          } else {
            return id;
          }
        })
        .then(() => this.getPartWhilePartial(LOT_NO));
    } else {
      return Promise.reject('无 msn_dtl 的ID数据');
    }
  }

  @CacheResult()
  getAsnForInstruction({ lot_no, pk_no, vendor_code, part_no, site = 'MSL' }) {
    lot_no = toStoreString(lot_no);
    pk_no = toStoreString(pk_no);
    vendor_code = toStoreString(vendor_code);
    part_no = toStoreString(part_no);
    let moreSql = '';
    site = toStoreString(site);
    moreSql = `and (${site} is null or NVL(a.site,'MSL') = ${site})`;
    return this.databaseService
      .search(
        `select * from mhub_asn_mst a where (${lot_no} is null or a.lot_no = ${lot_no})
    and (${pk_no} is null or a.PK_NO = ${pk_no})
    and (a.PK_STATUS = '2' or ((a.PK_STATUS = '4' or a.PK_STATUS = '3') and (exists
      ( select 1 from mhub_asn_dtl b where a.lot_no = b.lot_no and
        (b.OUT_SHIP_VIA = 'HOLD' or b.OUT_SHIP_VIA = 'HOLD IN HUB')) or a.HOLD_FLAG in ('B','H'))))
    and a.PK_KIND = '0'
    and exists (select 1 from mhub_asn_dtl b where a.lot_no = b.lot_no and (${vendor_code} is null or b.vendor_code = ${vendor_code})
    and (${part_no} is null or b.part_no = ${part_no}))
    ${moreSql}
    order by DOC_DATE desc`,
        { cacheTime: 1000 * 60 },
      )
      .then(ls => ls.slice(0, 50));
  }

  @CacheResult()
  async getInstructionReport({ mc, instruction_date, lot_no, site = 'MSL'}) {
    mc = toStoreString(mc);
    lot_no = toStoreString(lot_no);
    site = toStoreString(site);
    const [from, to] = getStoreDateRange(instruction_date);
    const all = await this.databaseService.search(
      `select ID, MC_CODE, NVL(a.oldlot_no,a.lot_no) lot_no, instruction_date, (case outbound_remark
          when 'W' then 'W'
          else 'P'
         end
         ) outbound_remark, out_ship_via, MHK_ETD,out_ship_remark
  ,(select pk_status from mhub_asn_mst b where b.lot_no = NVL(a.oldlot_no,a.lot_no) and rownum = 1) pk_status,
  a.part_no, a.last_ship_via from mhub_asn_dtl a
  where outbound_remark is not null and out_ship_via is not null and (${mc} is null or a.MC_CODE = ${mc})
  AND (${from} is null or trunc(a.instruction_date) >= ${from})
    and (${to} is null or trunc(a.instruction_date) <= ${to})
    and (${lot_no} is null or NVL(a.oldlot_no,a.lot_no) = ${lot_no})
    and exists (select 1 from mhub_asn_mst c where ${site} is null or NVL(c.site,'MSL') = ${site})`,
    );
    const p = [],
      w = [];
    all.forEach(_ => {
      if (_.OUTBOUND_REMARK === 'W') {
        w.push(_);
      } else {
        p.push(_);
      }
    });
    const filter1 = [].concat(p);
    if (w.length > 0) {
      const cW = arrayClassifyByOne(w, 'LOT_NO');
      Object.keys(cW).forEach(prop => {
        const ls = cW[prop];
        if (ls && ls.length > 0) {
          const parts = ls.map(l => l.PART_NO);
          const val = ls[0];
          val.PART_NO = Array.from(new Set(parts));
          filter1.push(val);
        }
      });
    }
    const filter2 = filter1
      .filter(f => {
        if (
          f.OUT_SHIP_VIA === 'SEA' &&
          ['HOLD', 'HOLD IN HUB'].indexOf(f.LAST_SHIP_VIA) < 0
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) =>
        sortUtils.byDate(a.INSTRUCTION_DATE, b.INSTRUCTION_DATE, false),
      );
    const ls = await Promise.all(
      filter2.map(a => {
        return this.databaseService
          .search(
            `select SO_NO, creation_date, ASN_DTL_ID from mhub_so_mst
      where lot_no = '${a.LOT_NO}' and so_status = 'N'`,
          )
          .then(rows => {
            if (rows.length > 0) {
              if (a.OUTBOUND_REMARK === 'W') {
                return Object.assign({}, a, rows[0]);
              } else {
                const tar = rows.find(r1 => {
                  const idList: number[] = r1.ASN_DTL_ID
                    ? r1.ASN_DTL_ID.split(',').map(_ => +_)
                    : [];
                  return idList.indexOf(a.ID) > -1;
                });
                if (tar) {
                  return Object.assign({}, a, tar);
                } else {
                  return Object.assign({}, a, rows[0]);
                }
              }
            } else {
              a.SO_NO = 'N/A';
              return a;
            }
          });
      }),
    );
    return ls;
  }
}
