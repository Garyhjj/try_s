import { DatabaseService } from './../../core/database.service';
import { UtilsService } from './../utils/utils.service';
import { Injectable } from '@nestjs/common';
import { toStoreString } from '../../shared/tables';
import { CacheResult } from '../../shared/decorators';

@Injectable()
export class OnwayService {
  constructor(
    private utilsService: UtilsService,
    private databaseService: DatabaseService,
  ) {}

  @CacheResult()
  async onwayInquire({ lot_no, part_no, bu }) {
    lot_no = toStoreString(lot_no);
    part_no = toStoreString(part_no);
    bu = toStoreString(bu);
    const ls = await this.databaseService
      .search(`select g.*,(SELECT  BUYER_EMPNO
        FROM mhub_MC_BUYER_INFO h where h.part_no = g.part_no and h.bu = g.bu_code and rownum = 1) AS buyer,
        (SELECT  MC_EMPNO
          FROM mhub_MC_BUYER_INFO h where h.part_no = g.part_no and h.bu = g.bu_code and rownum = 1) AS mc,
          (select mhk_etd from mhub_asn_mst a where pk_kind='2'  and mhk_etd is not null  and rownum = 1
          and old_lot_no = g.lot_no) as mhk_etd,
          (select RECEIVED_DATE from MHUB_RECEIVED_WH_DATE where in_lot_no = g.lot_no and rownum = 1) RECEIVED_DATE,
          (select CREATION_DATE from mhub_label where lot_no = g.lot_no and rownum = 1) LABEL_DATE
           from (select distinct * from (SELECT a.*,
   P.PO_SIC
  FROM mhub_onway_v a, mhub_mwp_onway b, mhub_PO_DTL P
  WHERE P.PO_NO = B.PO_NUMBER
  AND (${lot_no} is null or a.lot_no = ${lot_no})
  AND (${part_no} is null or a.part_no = ${part_no})
  AND (${bu} is null or a.bu_code = ${bu})
  AND P.PO_SNO = B.PO_LINE
  AND a.lot_no = b.lot_number
  AND a.part_no = b.part_no
  and B.process_flag = 1
  and a.buyer_company <> '99999')) g`);
    const partialOut = [];
    ls.forEach(l => {
      const { OUTBOUND_REMARK } = l;
      if (!OUTBOUND_REMARK || OUTBOUND_REMARK === 'W') {
      } else {
        partialOut.push(l);
      }
    });
    const getMhkEtdForP = async (in_no, part_num) => {
      const res = await this.databaseService
        .search(`select mhk_etd,lot_no, (select creation_date from mhub_label l where l.lot_no= '${in_no}'
      and l.SO_NO = a.SO_REC and rownum = 1) LABEL_DATE, SHIP_VIA
        from mhub_asn_mst a where pk_kind='2'  and mhk_etd is not null
      and old_lot_no = '${in_no}' and exists (select 1 from mhub_inv_dtl b  where a.lot_no = b.lot_no and part_no = '${part_num}')
      order by mhk_etd desc`);
      if (res.length > 0) {
        return res[0];
      } else {
        return {
          MHK_ETD: '',
          LOT_NO: '',
          LABEL_DATE: '',
          SHIP_VIA: '',
        };
      }
    };
    const getReceiveDateForP = async out_lot => {
      const res = await this.databaseService.search(
        `select RECEIVED_DATE from MHUB_RECEIVED_WH_DATE where out_lot_no = '${out_lot}'`,
      );
      return res.length > 0 ? res[0].RECEIVED_DATE : '';
    };
    let pLg = partialOut.length;
    while (pLg--) {
      const l = partialOut[pLg];
      const { MHK_ETD, LOT_NO, LABEL_DATE, SHIP_VIA } = await getMhkEtdForP(
        l.LOT_NO,
        l.PART_NO,
      );
      let receive_date = '';
      if (LOT_NO) {
        receive_date = await getReceiveDateForP(LOT_NO);
      }
      l.MHK_ETD = MHK_ETD;
      l.LABEL_DATE = LABEL_DATE;
      l.RECEIVED_DATE = receive_date;
      if (SHIP_VIA) {
        l.SHIP_VIA = SHIP_VIA;
      }
    }
    const [allOutMst, allInMst, allAA, allShort] = await Promise.all([
      this.databaseService.search(
        `select ship_via, pk_status, OLD_lot_no from mhub_asn_mst where pk_kind='2'`,
      ),
      this.databaseService.search(
        `select doc_date, lot_no from mhub_asn_mst where pk_kind='0'`,
      ),
      this.databaseService.search(`select * FROM mhub_aa_mst`),
      this.databaseService.search(`select * FROM mhub_shortage`),
    ]);
    return await Promise.all(
      ls.map(l => {
        if (l.SHIP_VIA !== 'EXPRESS') {
          l.MHK_ETA = l.LABEL_DATE;
        }
        let vbu;
        switch (l.BU_CODE) {
          case 'SBU':
            vbu = 'SSU';
            break;
          case 'PBU':
            vbu = 'SPU';
            break;
          case 'NBU':
            vbu = 'SNU';
            break;
          case 'NMB':
            vbu = 'SNU';
            break;
          case 'GLO':
            vbu = 'SSU';
            break;
          case 'HD':
            vbu = 'PPL';
            break;
          default:
            vbu = l.BU_CODE;
        }
        const getRecQTY = async (d, buC) => {
          const res = allAA.filter(
            _ =>
              _.LOT_NO === d.LOT_NO && _.PART_NO === d.PART_NO && _.BU === buC,
          );
          return res.length > 0 ? res[0].QTY : 0;
        };
        const getShortageMes = async (d, r_qty) => {
          const res = allShort.filter(
            _ =>
              _.LOT_NO === d.LOT_NO &&
              _.PART_NO === d.PART_NO &&
              _.BU === d.BU_CODE,
          );
          let vs_qty, s_rem, s_user, b_qty;
          if (res.length > 0) {
            const tar = res[0];
            vs_qty = tar.SHORTAGE_QTY;
            s_rem = tar.REMARK;
            s_user = tar.USER_NAME;
          } else {
            vs_qty = 0;
            s_rem = 'N/A';
            s_user = 'N/A';
          }
          d.BALANCE_QTY = d.BALANCE_QTY || 0;
          b_qty = d.BALANCE_QTY - vs_qty - r_qty;
          return { b_qty, s_rem, s_user, vs_qty };
        };
        const getOutShipViaAndPkStatus = async d => {
          const res = allOutMst.filter(_ => _.OLD_LOT_NO === d.LOT_NO);
          const out_ship_via = res.map(_ => _.SHIP_VIA);
          const status = d.PK_STATUS;
          let outStatus;
          if (status === '4') {
            const hasOut = res.filter(
              _ => ['7', '8', '9', 'C'].indexOf(_.PK_STATUS) > -1,
            );
            if (hasOut) {
              outStatus = '4';
            } else {
              outStatus = '3.5';
            }
          } else {
            outStatus = status;
          }
          return { out_ship_via, pk_status: outStatus };
        };
        const getDocDate = async d => {
          const tar = allInMst.find(_ => _.LOT_NO === d.LOT_NO);
          if (tar) {
            return tar.DOC_DATE;
          }
        };
        return Promise.all([
          getRecQTY(l, vbu)
            .then(rcv_qty => {
              l.rcv_qty = rcv_qty || 0;
              return getShortageMes(l, rcv_qty);
            })
            .then(res => Object.assign(l, res)),
          getOutShipViaAndPkStatus(l).then(res => Object.assign(l, res)),
          getDocDate(l).then(res => (l.DOC_DATE = res)),
        ]).then(() => l);
      }),
    );
  }
}
