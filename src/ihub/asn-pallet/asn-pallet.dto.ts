import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const AsnPalletObject: EntityObject = {
  tableName: 'MHUB_ASN_PALLET',
  primaryKeyId: 'ID',
  seqName: 'MHUB_ASN_PALLET_SEQ',
};

export const AsnPalletEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  LOT_NO: { type: 'string' },
  PK_NO: { type: 'string' },
  OLD_PALLET_FROM: { type: 'number' },
  OLD_PALLET_TO: { type: 'number' },
  PACKAGE_TYPE: { type: 'string' },
  PALLET_FROM: { type: 'number' },
  PALLET_TO: { type: 'number' },
  PALLET_GROSS_WEIGHT: { type: 'number' },
  PALLET_CBM: { type: 'string' },
  PART_DESC: { type: 'string' },
  TOTAL_PALLET: { type: 'number' },
  TOTAL_CARTON: { type: 'number' },
  TOTAL_QTY: { type: 'number' },
  PALLET_NET_WEIGHT: { type: 'number' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class AsnPalletInterface {
  ID: number;
  CUSTOMER_CODE: string;
  BUYER_COMPANY: string;
  SELLER_COMPANY: string;
  LOT_NO: string;
  PK_NO: string;
  OLD_PALLET_FROM: number;
  OLD_PALLET_TO: number;
  PACKAGE_TYPE: string;
  PALLET_FROM: number;
  PALLET_TO: number;
  PALLET_GROSS_WEIGHT?: number;
  PALLET_CBM?: string;
  TOTAL_PALLET?: number;
  TOTAL_CARTON?: number;
  TOTAL_QTY?: number;
  PALLET_NET_WEIGHT?: number;
  CREATION_DATE?: string;
  LAST_UPDATE_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATED_BY?: number;
  PART_NO?: string;
  CARTON_FROM?: string;
  CARTON_TO?: string;
  CARTON_QTY?: string;
  CARTON_CBM?: string;
  ORIGIN_COUNTRY?: string;
  TOTAL_CASE?: string;
  CARTON_GROSS_WEIGHT?: string;
  CARTON_NET_WEIGHT?: string;
  ITEM_GROSS_WEIGHT?: string;
  PART_DESC?: string;
}
