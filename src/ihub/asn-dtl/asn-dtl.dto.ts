import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const AsnDtlObject: EntityObject = {
  tableName: 'MHUB_ASN_DTL',
  primaryKeyId: 'ID',
  seqName: 'MHUB_ASN_DTL_SEQ',
};

export const AsnDtlEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  STO_NO: { type: 'string' },
  LOT_NO: { type: 'string' },
  OLDLOT_NO: { type: 'string' },
  OLDSTO_NO: { type: 'string' },
  PK_NO: { type: 'string' },
  PK_SNO: { type: 'number' },
  HI_NO: { type: 'string' },
  PART_NO: { type: 'string' },
  PART_DESC: { type: 'string' },
  VENDOR_CODE: { type: 'string' },
  VPART_NO: { type: 'string' },
  VPART_DESC: { type: 'string' },
  SPAREREMARK: { type: 'string' },
  OLD_CARTON_FROM: { type: 'number' },
  OLD_CARTON_TO: { type: 'number' },
  PALLET_FROM: { type: 'number' },
  PALLET_TO: { type: 'number' },
  CARTON_FROM: { type: 'number' },
  CARTON_TO: { type: 'number' },
  CARTON_QTY: { type: 'number' },
  CASE_QTY: { type: 'number' },
  TOTAL_CARTON: { type: 'number' },
  TOTAL_CASE: { type: 'string' },
  TOTAL_QTY: { type: 'number' },
  DATE_CODE: { type: 'string' },
  WEIGHT_UNIT: { type: 'string' },
  UOM_WEIGHT: { type: 'number' },
  CARTON_GROSS_WEIGHT: { type: 'number' },
  ITEM_NET_WEIGHT: { type: 'number' },
  ITEM_GROSS_WEIGHT: { type: 'number' },
  CARTON_LENGTH: { type: 'number' },
  CARTON_WIDTH: { type: 'number' },
  CARTON_HEIGHT: { type: 'number' },
  CARTON_CBM: { type: 'number' },
  RECEIVED_CARTON: { type: 'number' },
  RECEIVED_CASE: { type: 'number' },
  RECEIVED_QTY: { type: 'number' },
  STO_STATUS: { type: 'string' },
  OUTBOUND_REMARK: { type: 'string' },
  OUT_BU: { type: 'string' },
  MC_CODE: { type: 'string' },
  OUT_SHIP_VIA: { type: 'string' },
  MHK_ETD: { type: 'string' },
  QUANTITY_UOM: { type: 'string' },
  ORIGIN_COUNTRY: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATED_BY: { type: 'number' },
  IS_CREATED_SO: { type: 'string' },
  OUT_SHIP_REMARK: { type: 'string' },
  INSTRUCTION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_SHIP_VIA: { type: 'string' },
};

export class AsnDtlInterface {
  ID: number;
  CUSTOMER_CODE: string;
  BUYER_COMPANY: string;
  SELLER_COMPANY: string;
  STO_NO: string;
  LOT_NO: string;
  OLDLOT_NO?: string;
  OLDSTO_NO?: string;
  PK_NO: string;
  PK_SNO: number;
  HI_NO?: string;
  PART_NO: string;
  PART_DESC?: string;
  VENDOR_CODE: string;
  VPART_NO?: string;
  VPART_DESC?: string;
  SPAREREMARK?: string;
  OLD_CARTON_FROM: number;
  OLD_CARTON_TO: number;
  PALLET_FROM: number;
  PALLET_TO: number;
  CARTON_FROM: number;
  CARTON_TO: number;
  CARTON_QTY?: number;
  CASE_QTY?: number;
  TOTAL_CARTON?: number;
  TOTAL_CASE?: string;
  TOTAL_QTY?: number;
  DATE_CODE?: string;
  WEIGHT_UNIT?: string;
  UOM_WEIGHT?: number;
  CARTON_GROSS_WEIGHT?: number;
  ITEM_NET_WEIGHT?: number;
  ITEM_GROSS_WEIGHT?: number;
  CARTON_LENGTH?: number;
  CARTON_WIDTH?: number;
  CARTON_HEIGHT?: number;
  CARTON_CBM?: number;
  RECEIVED_CARTON?: number;
  RECEIVED_CASE?: number;
  RECEIVED_QTY?: number;
  STO_STATUS: string;
  OUTBOUND_REMARK?: string;
  OUT_BU?: string;
  MC_CODE?: string;
  OUT_SHIP_VIA?: string;
  MHK_ETD?: string;
  QUANTITY_UOM?: string;
  ORIGIN_COUNTRY?: string;
  CREATION_DATE?: string;
  LAST_UPDATE_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATED_BY?: number;
  IS_CREATED_SO?: string;
  OUT_SHIP_REMARK?: string;
  INSTRUCTION_DATE?: string;
  LAST_SHIP_VIA?: string;
}
