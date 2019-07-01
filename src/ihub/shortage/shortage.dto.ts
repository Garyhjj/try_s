import { EntityObject } from 'class/entity-object.class';

export const ShortageObject: EntityObject = {
  tableName: 'mhub_shortage',
  primaryKeyId: 'ID',
  seqName: 'mhub_shortage_SEQ',
};
export const ShortageEntity = {
  ID: { type: 'number' },
  PK_STATUS: { type: 'string' },
  SHORTAGE_QTY: { type: 'string' },
  REMARK: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  USER_NAME: { type: 'string' },
  CUSTOMER_CODE: { type: 'string' },
  PART_NO: { type: 'string' },
  LOT_NO: { type: 'string' },
  ATA_MSL: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  BU: { type: 'string' },
  VENDER: { type: 'string' },
  PART_DESC: { type: 'string' },
  UNIT_PRICE: { type: 'string' },
  DOC_QTY: { type: 'string' },
  ACTUAL_QTY: { type: 'string' },
  MC: { type: 'string' },
  FLAG: { type: 'string' },
  DOC_DATE: { type: 'string' },
  TRN_DATE: { type: 'string' },
  OUT_LOT_NO: { type: 'string' },
  HI_NO: { type: 'string' },
  PIC_DESC: { type: 'string' },
  MAIL_FLAG: { type: 'number' },
  SHORT_REMARK: { type: 'string' },
  CUSTOM_M: { type: 'string' },
  CUSTOM_RATE: { type: 'number' },
  B_OK_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  AUTO_MAIL_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};
export class Shortage {
  ID: number;
  PK_STATUS: string;
  SHORTAGE_QTY: string;
  REMARK?: string;
  BUYER_COMPANY?: string;
  SELLER_COMPANY: string;
  USER_NAME: string;
  CUSTOMER_CODE: string;
  PART_NO: string;
  LOT_NO: string;
  ATA_MSL?: string;
  BU: string;
  VENDER: string;
  PART_DESC?: string;
  UNIT_PRICE: string;
  DOC_QTY: string;
  ACTUAL_QTY?: string;
  MC?: string;
  FLAG?: string;
  DOC_DATE?: string;
  TRN_DATE?: string;
  OUT_LOT_NO?: string;
  HI_NO?: string;
  PIC_DESC?: string;
  MAIL_FLAG?: number;
  SHORT_REMARK?: string;
  CUSTOM_M?: string;
  CUSTOM_RATE?: number;
  B_OK_DATE?: string;
  AUTO_MAIL_DATE?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
