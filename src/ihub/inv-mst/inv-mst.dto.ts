import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const InvMstObject: EntityObject = {
  tableName: 'MHUB_INV_MST',
  primaryKeyId: 'ID',
  seqName: 'MHUB_INV_MST_SEQ',
};

export const InvMstEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  PK_NO: { type: 'string' },
  PK_VERSION: { type: 'number' },
  BU_CODE: { type: 'string' },
  LOT_NO: { type: 'string' },
  INV_NO: { type: 'string' },
  DOC_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  DELIVERY_TERM: { type: 'string' },
  PAYMENT_TERM1: { type: 'string' },
  PAYMENT_TERM2: { type: 'string' },
  CURRENCY: { type: 'string' },
  FOB_CHARGE: { type: 'number' },
  INSURANCE_AMOUNT: { type: 'string' },
  FREIGHT_AMOUNT: { type: 'number' },
  TOTAL_CHARGE: { type: 'number' },
  KEYIN_MH: { type: 'string' },
  KEYINFINISH_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CLOSE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  INV_STATUS: { type: 'string' },
  PROCESS_FLAG: { type: 'string' },
  PAYMENT_AMOUNT1: { type: 'number' },
  PAYMENT_AMOUNT2: { type: 'number' },
  CHARGE_TYPE: { type: 'string' },
  TRN_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  INV_TYPE: { type: 'string' },
  EDI_KEY: { type: 'number' },
  SHIP_TYPE: { type: 'string' },
  SHIPPING_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  VENDOR_CODE: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class InvMstInterface {
  ID: number;
  CUSTOMER_CODE: string;
  BUYER_COMPANY: string;
  SELLER_COMPANY: string;
  PK_NO: string;
  PK_VERSION?: number;
  BU_CODE: string;
  LOT_NO: string;
  INV_NO: string;
  DOC_DATE: string;
  DELIVERY_TERM?: string;
  PAYMENT_TERM1?: string;
  PAYMENT_TERM2?: string;
  CURRENCY?: string;
  FOB_CHARGE?: number;
  INSURANCE_AMOUNT?: string;
  FREIGHT_AMOUNT?: number;
  TOTAL_CHARGE?: number;
  KEYIN_MH?: string;
  KEYINFINISH_DATE?: string;
  CLOSE_DATE?: string;
  INV_STATUS?: string;
  PROCESS_FLAG: string;
  PAYMENT_AMOUNT1?: number;
  PAYMENT_AMOUNT2?: number;
  CHARGE_TYPE?: string;
  TRN_DATE: string;
  INV_TYPE: string;
  EDI_KEY?: number;
  SHIP_TYPE?: string;
  SHIPPING_DATE?: string;
  VENDOR_CODE: string;
  CREATION_DATE?: string;
  LAST_UPDATE_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATED_BY?: number;
}
