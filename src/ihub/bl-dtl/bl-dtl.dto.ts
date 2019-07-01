import { EntityObject } from 'class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const BlDtlObject: EntityObject = {
  tableName: 'MHUB_BL_DTL',
  primaryKeyId: 'ID',
  seqName: 'MHUB_BL_DTL_SEQ',
};

export const BlDtlEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  MAWB: { type: 'string' },
  HAWB: { type: 'string' },
  SNO: { type: 'string' },
  FWD_CODE: { type: 'string' },
  PAYMENT_TERM: { type: 'string' },
  CBM: { type: 'string' },
  CONTAINER_SIZE: { type: 'string' },
  CONTAINER_NO: { type: 'string' },
  SEAL_NO: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class BlDtlInterface {
  ID: number;
  CUSTOMER_CODE: string;
  SELLER_COMPANY: string;
  BUYER_COMPANY: string;
  MAWB: string;
  HAWB: string;
  SNO: string;
  FWD_CODE: string;
  PAYMENT_TERM?: string;
  CBM?: string;
  CONTAINER_SIZE?: string;
  CONTAINER_NO?: string;
  SEAL_NO: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
