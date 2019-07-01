import { EntityObject } from '../../class/entity-object.class';
export const CustomListObject: EntityObject = {
  tableName: 'MHUB_CUSTOM_LIST',
  primaryKeyId: 'ID',
  seqName: 'MHUB_CUSTOM_LIST_SEQ',
};

export const CustomListEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  LOT_NO: { type: 'string' },
  OUTLOT_NO: { type: 'string' },
  DECLARATION_STATUS: { type: 'string' },
  DECLARATION_TYPE: { type: 'string' },
  TAX_AMOUNT: { type: 'string' },
  DEPTNO: { type: 'string' },
  ETA: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  NAME: { type: 'string' },
  LIST_NO: { type: 'string' },
  UNIFIED_NO: { type: 'string' },
  ENT_NO: { type: 'string' },
  UPDATE_TIME: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATE_BY: { type: 'string' },
  GOODS_STATUS: { type: 'number' },
  UPDATE_TIME2: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATE_BY2: { type: 'string' },
  ATTRIBUTE1: { type: 'string' },
  ATTRIBUTE2: { type: 'string' },
  ATTRIBUTE3: { type: 'string' },
  ATTRIBUTE4: { type: 'string' },
  ATTRIBUTE5: { type: 'string' },
  ETD: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CUSTOM_STATUS: { type: 'string' },
  WH_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  BL_NO: { type: 'string' },
  CUSTOMS_TIME: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  ATA_HK: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  ETA_RQ: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CHARGER_NAME: { type: 'string' },
  MATERIAL_LEVEL: { type: 'string' },
  MC_NAME_TEL: { type: 'string' },
  CUSTOMS_TYPE: { type: 'string' },
  COMMERCE_TYPE: { type: 'string' },
  PW_OK: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  TS_OK: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  SJ_OK: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CONTAINER_NO: { type: 'string' },
  OLD_BILL_NO: { type: 'string' },
  REMARK: { type: 'string' },
  SHIP_VIA: { type: 'string' },
  CUSTOMS_FLAG: { type: 'number' },
  CUSTOM_STATUS2: { type: 'string' },
  ATTRIBUTE6: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  ATTRIBUTE7: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  ATTRIBUTE8: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class CustomList {
  ID: number;
  CUSTOMER_CODE: string;
  LOT_NO: string;
  OUTLOT_NO: string;
  DECLARATION_STATUS: string;
  DECLARATION_TYPE: string;
  TAX_AMOUNT: string;
  DEPTNO: string;
  ETA: Date;
  NAME: string;
  LIST_NO: string;
  UNIFIED_NO: string;
  ENT_NO: string;
  UPDATE_TIME: Date;
  LAST_UPDATE_BY: string;
  GOODS_STATUS: number;
  UPDATE_TIME2: Date;
  LAST_UPDATE_BY2: string;
  ATTRIBUTE1: string;
  ATTRIBUTE2: string;
  ATTRIBUTE3: string;
  ATTRIBUTE4: string;
  ATTRIBUTE5: string;
  ETD: Date;
  CUSTOM_STATUS: string;
  WH_DATE: Date;
  BL_NO: string;
  CUSTOMS_TIME: Date;
  ATA_HK: Date;
  ETA_RQ: Date;
  CHARGER_NAME: string;
  MATERIAL_LEVEL: string;
  MC_NAME_TEL: string;
  CUSTOMS_TYPE: string;
  COMMERCE_TYPE: string;
  PW_OK: Date;
  TS_OK: Date;
  SJ_OK: Date;
  CONTAINER_NO: string;
  OLD_BILL_NO: string;
  REMARK: string;
  SHIP_VIA: string;
  CUSTOMS_FLAG: number;
  CUSTOM_STATUS2: string;
  ATTRIBUTE6: Date;
  ATTRIBUTE7: string;
  BUYER_COMPANY: string;
  ATTRIBUTE8: string;
  CREATION_DATE: Date;
  CREATED_BY: number;
  LAST_UPDATE_DATE: Date;
  LAST_UPDATED_BY: number;
}
