import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const PoDtlObject: EntityObject = {
  tableName: 'MHUB_PO_DTL',
  primaryKeyId: 'ID',
  seqName: 'MHUB_PO_DTL_SEQ',
};

export const PoDtlEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  PO_NO: { type: 'string' },
  PO_SNO: { type: 'number' },
  OWNER_CODE: { type: 'string' },
  MANUFACT_CODE: { type: 'string' },
  PO_BU: { type: 'string' },
  PO_SIC: { type: 'string' },
  PART_NO: { type: 'string' },
  PART_DESC: { type: 'string' },
  VENDOR_CODE: { type: 'string' },
  VPART_NO: { type: 'string' },
  VPART_DESC: { type: 'string' },
  REQUEST_QTY: { type: 'number' },
  REQUEST_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CANCEL_QTY: { type: 'number' },
  RECEIVED_QTY: { type: 'number' },
  REJECT_QTY: { type: 'number' },
  RECEIVED_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  RECEIVED_RTS: { type: 'number' },
  BALANCE_QTY: { type: 'number' },
  UNIT_PRICE: { type: 'number' },
  AMOUNT: { type: 'number' },
  CURRENCY: { type: 'string' },
  PO_STATUS: { type: 'string' },
  PO_PCN: { type: 'string' },
  PO_DISTRIBUTION_ID: { type: 'number' },
  CHANGE_TIMES: { type: 'number' },
  QVL_VENDOR_CODE: { type: 'string' },
  QVL_VENDOR_NAME: { type: 'string' },
  VENDOR_PRODUCT_NUM: { type: 'string' },
  ATTRIBUTE1: { type: 'string' },
  ATTRIBUTE2: { type: 'string' },
  ATTRIBUTE3: { type: 'string' },
  ATTRIBUTE4: { type: 'string' },
  ATTRIBUTE5: { type: 'string' },
  ATTRIBUTE6: { type: 'string' },
  ATTRIBUTE7: { type: 'string' },
  ATTRIBUTE8: { type: 'string' },
  ATTRIBUTE9: { type: 'string' },
  ATTRIBUTE10: { type: 'string' },
  ATTRIBUTE11: { type: 'string' },
  ATTRIBUTE12: { type: 'string' },
  ATTRIBUTE13: { type: 'string' },
  ATTRIBUTE14: { type: 'string' },
  ATTRIBUTE15: { type: 'string' },
  ATTRIBUTE16: { type: 'string' },
  ATTRIBUTE17: { type: 'string' },
  ATTRIBUTE18: { type: 'string' },
  ATTRIBUTE19: { type: 'string' },
  ATTRIBUTE20: { type: 'string' },
  PO_UNIT: { type: 'string' },
  SITE_CODE: { type: 'string' },
  MSL_SIC_CODE: { type: 'string' },
  MSL_BU_CODE: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class PoDtlInterface {
  ID: number;
  CUSTOMER_CODE: string;
  PO_NO: string;
  PO_SNO: number;
  OWNER_CODE?: string;
  MANUFACT_CODE?: string;
  PO_BU?: string;
  PO_SIC?: string;
  PART_NO: string;
  PART_DESC?: string;
  VENDOR_CODE?: string;
  VPART_NO?: string;
  VPART_DESC?: string;
  REQUEST_QTY?: number;
  REQUEST_DATE?: string;
  CANCEL_QTY?: number;
  RECEIVED_QTY?: number;
  REJECT_QTY?: number;
  RECEIVED_DATE?: string;
  RECEIVED_RTS?: number;
  BALANCE_QTY: number;
  UNIT_PRICE?: number;
  AMOUNT?: number;
  CURRENCY?: string;
  PO_STATUS?: string;
  PO_PCN?: string;
  PO_DISTRIBUTION_ID?: number;
  CHANGE_TIMES?: number;
  QVL_VENDOR_CODE?: string;
  QVL_VENDOR_NAME?: string;
  VENDOR_PRODUCT_NUM?: string;
  ATTRIBUTE1?: string;
  ATTRIBUTE2?: string;
  ATTRIBUTE3?: string;
  ATTRIBUTE4?: string;
  ATTRIBUTE5?: string;
  ATTRIBUTE6?: string;
  ATTRIBUTE7?: string;
  ATTRIBUTE8?: string;
  ATTRIBUTE9?: string;
  ATTRIBUTE10?: string;
  ATTRIBUTE11?: string;
  ATTRIBUTE12?: string;
  ATTRIBUTE13?: string;
  ATTRIBUTE14?: string;
  ATTRIBUTE15?: string;
  ATTRIBUTE16?: string;
  ATTRIBUTE17?: string;
  ATTRIBUTE18?: string;
  ATTRIBUTE19?: string;
  ATTRIBUTE20?: string;
  PO_UNIT?: string;
  SITE_CODE?: string;
  MSL_SIC_CODE?: string;
  MSL_BU_CODE?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
