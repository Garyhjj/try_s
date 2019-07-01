import { EntityObject } from './../../class/entity-object.class';

export const Mhub_PacklistObject: EntityObject = {
  tableName: 'MHUB_PACKLIST',
  primaryKeyId: 'ID',
  seqName: 'MHUB_PACKLIST_SEQ',
};

export const MhubPacklistEntity =
{
  ID: { type: 'number' },
  CUSTOMER_COMPANY: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  LOT_NO: { type: 'string' },
  PART_NO: { type: 'string' },
  PART_DESC: { type: 'string' },
  PART_MARK: { type: 'string' },
  PALLET_FROM: { type: 'number' },
  PALLET_TO: { type: 'number' },
  CARTON_FROM: { type: 'number' },
  CARTON_TO: { type: 'number' },
  ORIGIN_COUNTRY: { type: 'string' },
  CARTON_QTY: { type: 'number' },
  TOTAL_QTY: { type: 'number' },
  TOTAL_C_N_WEIGHT: { type: 'number' },
  C_N_WEIGHT: { type: 'number' },
  TOTAL_C_G_WEIGHT: { type: 'number' },
  C_G_WEIGHT: { type: 'number' },
  UPDATE_TIME: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  PACKAGE_TYPE: { type: 'string' },
  TOTAL_CARTON: { type: 'number' },
  TOTAL_PALLET: { type: 'number' },
  PO_NO: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class MhubPacklistInterface {
  ID: number;
  CUSTOMER_COMPANY: string;
  BUYER_COMPANY?: string;
  SELLER_COMPANY?: string;
  LOT_NO: string;
  PART_NO: string;
  PART_DESC?: string;
  PART_MARK?: string;
  PALLET_FROM?: number;
  PALLET_TO?: number;
  CARTON_FROM: number;
  CARTON_TO: number;
  ORIGIN_COUNTRY?: string;
  CARTON_QTY?: number;
  TOTAL_QTY?: number;
  TOTAL_C_N_WEIGHT?: number;
  C_N_WEIGHT?: number;
  TOTAL_C_G_WEIGHT?: number;
  C_G_WEIGHT?: number;
  UPDATE_TIME?: string;
  PACKAGE_TYPE: string;
  TOTAL_CARTON?: number;
  TOTAL_PALLET?: number;
  PO_NO?: string;
  EPTG_DESC: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
