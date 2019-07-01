import { DatabaseService } from './../../core/database.service';
import { Injectable } from '@nestjs/common';
import { isArray } from 'util';
import { CacheResult } from '../../shared/decorators';

const PART_MES = 'part_mes';
@Injectable()
export class UtilsService {
  constructor(private databaseService: DatabaseService) {}

  @CacheResult(1000 * 30)
  async getMcAndBuyer(part_no, bu) {
    if (part_no && bu) {
      const res = await this.databaseService
        .search(`SELECT  MC_EMPNO, BUYER_EMPNO
        FROM mhub_MC_BUYER_INFO
       WHERE part_no = TRIM('${part_no}')
         AND bu = '${bu}'
         AND ROWNUM = 1`);
      const tar = res[0] || { MC_EMAIL: '', BUYER_EMAIL: '' };
      let { MC_EMPNO, BUYER_EMPNO } = tar;
      BUYER_EMPNO = BUYER_EMPNO || '';
      MC_EMPNO = MC_EMPNO || '';
      return {
        MC: MC_EMPNO,
        BUYER: BUYER_EMPNO,
      };
    } else {
      return { MC: '', BUYER: '' };
    }
  }

  getMcAndBuyers(data: { part_no: string; bu: string }[]) {
    const out = Object.create(null);
    if (isArray(data)) {
      return Promise.all(
        data.map(d => {
          const key = `${d.part_no}&${d.bu}`;
          return this.getMcAndBuyer(d.part_no, d.bu).then(
            res => (out[key] = res),
          );
        }),
      ).then(() => out);
    } else {
      return out;
    }
  }
}
