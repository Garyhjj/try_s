import { DatabaseTable } from './../../class/database-table.class';
import { DatabaseService } from './../../core/database.service';
import { UpdateObject } from './../../class/update-object.class';
import {
  DeliveryNoticeObject,
  DeliveryNoticeEntity,
  DeliveryNotice,
} from './delivery-notive.dto';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { toStoreString } from '../../shared/tables';
import { CacheResult } from '../../shared/decorators';

@Injectable()
export class DeliveryNoticeService {
  db: DatabaseTable;
  constructor(private databaseService: DatabaseService) {
    this.db = this.databaseService.getTableInstance(
      DeliveryNoticeObject,
      DeliveryNoticeEntity,
    );
  }

  @CacheResult()
  find(filter) {
    return this.db.find(filter);
  }

  async insert(body: DeliveryNotice, userId: number, opts?: any) {
    try {
      return await this.db.insert(body, userId, opts);
    } catch (e) {
      throw new Error(e);
    }
  }
  async update(body: UpdateObject, userId: number) {
    body.columns.LAST_UPDATE_DATE = moment().format('YYYY-MM-DD HH:mm:ss');
    delete body.columns.CREATION_DATE;
    try {
      return await this.db.update(body, userId);
    } catch (e) {
      throw new Error(e);
    }
  }
  async delete(id: number) {
    try {
      return await this.db.deleteById(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @CacheResult(1000 * 60)
  getDeportList() {
    return this.db.search('select * from mhub_TERM_BAS where term_type = 27');
  }

  @CacheResult()
  getInvMstBylotNo(no) {
    return this.db.search(
      `Select inv_no from mhub_inv_mst where lot_no='${no}'`,
    );
  }

  @CacheResult()
  getAsnForDeliveryNotice({ lot_no, pk_no }) {
    lot_no = toStoreString(lot_no);
    pk_no = toStoreString(pk_no);
    return this.db.search(
      `select * from mhub_asn_mst a where pk_status='2' and
    exists (select 1 from mhub_delivery_notice b where b.lot_no = a.lot_no)
    and (${lot_no} is null or a.lot_no = ${lot_no})
    and (${pk_no} is null or a.pk_no = ${pk_no})`,
    );
  }
}
