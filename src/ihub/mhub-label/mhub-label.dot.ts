import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const MhubLabelObject: EntityObject = {
  tableName: 'MHUB_LABEL',
  primaryKeyId: 'ID',
  seqName: 'MHUB_LABEL_SEQ',
};

export const MhubLabelEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  LOT_NO: { type: 'string' },
  SO_NO: { type: 'string' },
  VENDOR_SO: { type: 'string' },
  TOTAL_PALLET: { type: 'number' },
  TOTAL_CARTON: { type: 'number' },
  STATUS: { type: 'number' },
  VENDOR_NAME: { type: 'string' },
  EXPRESS_NO: { type: 'string' },
  CONTAINER_NO: { type: 'string' },
  REMARK: { type: 'string' },
  SHIP_VIA: { type: 'string' },
  BY_SEA: { type: 'string' },
  ONBOARD_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  MEASURE: { type: 'number' },
  WEIGHT: { type: 'number' },
  VENDOR_NAME2: { type: 'string' },
  PO_NO: { type: 'string' },
  INV_NO: { type: 'string' },
  BU_CODE: { type: 'string' },
  FWD_NAME: { type: 'string' },
  FLT_NO: { type: 'string' },
  MAWB: { type: 'string' },
  HAWB: { type: 'string' },
  PART_NO: { type: 'string' },
  PART_DESC: { type: 'string' },
  TOTAL_QTY: { type: 'number' },
  TOTAL_AMOUNT: { type: 'number' },
  ATTRIBUTE6: { type: 'string' },
  USER_NAME: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
  PALLET_TYPE: { type: 'string' },
  COMBINE_LOT_TYPE: {type: 'string'},
  ONBOARD_TIME: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
};

export class MhubLabelInterface {
  ID: number;
  CUSTOMER_CODE: string;
  LOT_NO: string;
  SO_NO: string;
  VENDOR_SO: string;
  TOTAL_PALLET?: number;
  TOTAL_CARTON?: number;
  STATUS?: number;
  VENDOR_NAME?: string;
  EXPRESS_NO?: string;
  CONTAINER_NO?: string;
  REMARK?: string;
  SHIP_VIA?: string;
  BY_SEA?: string;
  ONBOARD_DATE?: string;
  MEASURE?: number;
  WEIGHT?: number;
  VENDOR_NAME2?: string;
  PO_NO?: string;
  INV_NO?: string;
  BU_CODE?: string;
  FWD_NAME?: string;
  FLT_NO?: string;
  MAWB?: string;
  HAWB?: string;
  PART_NO?: string;
  PART_DESC?: string;
  TOTAL_QTY?: number;
  TOTAL_AMOUNT?: number;
  ATTRIBUTE6?: string;
  USER_NAME?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
  PALLET_TYPE?: string;
  COMBINE_LOT_TYPE?: string;
  ONBOARD_TIME?: string;
}
