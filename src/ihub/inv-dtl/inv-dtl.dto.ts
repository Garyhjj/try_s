import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const InvDtlObject: EntityObject = {
  tableName: 'MHUB_INV_DTL',
  primaryKeyId: 'ID',
  seqName: 'MHUB_INV_DTL_SEQ',
};

export const InvDtlEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  HI_NO: { type: 'string' },
  INV_NO: { type: 'string' },
  LOT_NO: { type: 'string' },
  INV_SNO: { type: 'number' },
  PART_NO: { type: 'string' },
  PART_DESC: { type: 'string' },
  VENDOR_CODE: { type: 'string' },
  VPART_NO: { type: 'string' },
  VPART_DESC: { type: 'string' },
  BU_CODE: { type: 'string' },
  PO_NO: { type: 'string' },
  PO_SNO: { type: 'number' },
  RECEIVED_QTY: { type: 'number' },
  UNIT_PRICE: { type: 'number' },
  AMOUNT: { type: 'number' },
  HI_STATUS: { type: 'string' },
  BALANCE_QTY: { type: 'number' },
  HO_NO: { type: 'string' },
  HIO_NO: { type: 'string' },
  I_FLAG: { type: 'string' },
  EDI_KEY: { type: 'number' },
  MSL_PO_NO: { type: 'string' },
  MSL_PO_SNO: { type: 'number' },
  KPO_NO: { type: 'string' },
  KPO_SNO: { type: 'number' },
  SIC: { type: 'string' },
  PO_UNIT_PRICE: { type: 'number' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class InvDtlInterface {
  ID: number;
  CUSTOMER_CODE: string;
  BUYER_COMPANY: string;
  SELLER_COMPANY: string;
  HI_NO: string;
  INV_NO: string;
  LOT_NO: string;
  INV_SNO: number;
  PART_NO: string;
  PART_DESC?: string;
  VENDOR_CODE: string;
  VPART_NO?: string;
  VPART_DESC?: string;
  BU_CODE: string;
  PO_NO: string;
  PO_SNO: number;
  RECEIVED_QTY: number;
  UNIT_PRICE?: number;
  AMOUNT?: number;
  HI_STATUS: string;
  BALANCE_QTY?: number;
  HO_NO?: string;
  HIO_NO: string;
  I_FLAG?: string;
  EDI_KEY?: number;
  MSL_PO_NO?: string;
  MSL_PO_SNO?: number;
  KPO_NO?: string;
  KPO_SNO?: number;
  SIC?: string;
  PO_UNIT_PRICE?: number;
  CREATION_DATE?: string;
  LAST_UPDATE_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATED_BY?: number;
}
