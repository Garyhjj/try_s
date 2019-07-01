import { EntityObject } from './../../class/entity-object.class';

export const MhubInvoiceListObject: EntityObject = {
  tableName: 'MHUB_INVOICE_LIST',
  primaryKeyId: 'ID',
  seqName: 'MHUB_INVOICE_LIST_SEQ',
};

export const MhubInvoiceListEntity =
{
  ID: { type: 'number' },
  LOT_NO: { type: 'string' },
  PART_NO: { type: 'string' },
  PART_DESC: { type: 'string' },
  ORIGIN_COUNTRY: { type: 'string' },
  RECEIVED_QTY: { type: 'number' },
  TOTAL_GROSS_WEIGHT: { type: 'number' },
  UNIT_PRICE: { type: 'number' },
  AMOUNT: { type: 'number' },
  SPAREREMARK: { type: 'string' },
  MAKER_NAME: { type: 'string' },
  MAKER_PN: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class MhubInvoiceListInterface {
  ID: number;
  LOT_NO: string;
  PART_NO: string;
  PART_DESC?: string;
  ORIGIN_COUNTRY?: string;
  RECEIVED_QTY: number;
  TOTAL_GROSS_WEIGHT?: number;
  UNIT_PRICE?: number;
  AMOUNT?: number;
  SPAREREMARK?: string;
  MAKER_NAME?: string;
  MAKER_PN?: string;
  HS_CODE_T?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
