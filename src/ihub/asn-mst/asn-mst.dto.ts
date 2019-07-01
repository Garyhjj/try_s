import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const AsnMstObject: EntityObject = {
  tableName: 'MHUB_ASN_MST',
  primaryKeyId: 'ID',
  seqName: 'MHUB_ASN_MST_SEQ',
};

export const AsnMstEntity = {
  SITE: { type: 'string' },
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  PK_NO: { type: 'string' },
  PK_VERSION: { type: 'number' },
  LOT_NO: { type: 'string' },
  DOC_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CONTRACT_NO: { type: 'string' },
  SHIP_FROM: { type: 'string' },
  SHIP_TO: { type: 'string' },
  SHIP_TO_ADDRESS: { type: 'string' },
  SHIP_TO_TEL: { type: 'string' },
  SHIP_TO_FAX: { type: 'string' },
  SHIP_TYPE: { type: 'string' },
  ATTENDANT: { type: 'string' },
  SHIPPING_MARK1: { type: 'string' },
  SHIPPING_MARK2: { type: 'string' },
  SHIPPING_MARK3: { type: 'string' },
  SHIPPING_MARK4: { type: 'string' },
  SHIPPING_MARK5: { type: 'string' },
  SHIPPING_MARK6: { type: 'string' },
  SHIPPING_MARK7: { type: 'string' },
  SHIP_VIA: { type: 'string' },
  ORIGIN_SHIP_VIA: { type: 'string' },
  SHIPPING_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CURRENCY: { type: 'string' },
  DELIVERY_TERM: { type: 'string' },
  PAYMENT_TERM: { type: 'string' },
  VENDOR_CODE: { type: 'string' },
  VENDOR_NAME: { type: 'string' },
  MBOL_NO: { type: 'string' },
  TOTAL_PACKAGE: { type: 'number' },
  TOTAL_PALLET: { type: 'number' },
  TOTAL_CARTON: { type: 'number' },
  TOTAL_QTY: { type: 'number' },
  TOTAL_NET_WEIGHT: { type: 'number' },
  TOTAL_GROSS_WEIGHT: { type: 'number' },
  WEIGHT_UOM: { type: 'string' },
  QUANTITY_UOM: { type: 'string' },
  PK_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  PK_TYPE: { type: 'string' },
  PK_KIND: { type: 'string' },
  EDI_FILE: { type: 'string' },
  REQUEST_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  RECEIVED_SNO: { type: 'string' },
  RECEIVED_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  RECEIVED_MH: { type: 'string' },
  RECEIVED_RTS: { type: 'number' },
  RECEIVED_PALLETS: { type: 'number' },
  RECEIVED_CARTONS: { type: 'number' },
  RECEIVED_QTY: { type: 'number' },
  KEYIN_MH: { type: 'string' },
  KEYINFINISH_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  IQC_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  IQC_CARTONS: { type: 'string' },
  MHK_ETA: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  TRANS_TYPE: { type: 'string' },
  MATERIAL_TYPE: { type: 'string' },
  FWD_CODE: { type: 'string' },
  FWD_NAME: { type: 'string' },
  TRANS_NO: { type: 'string' },
  MAWB: { type: 'string' },
  HAWB: { type: 'string' },
  WAREHOUSE_CODE: { type: 'string' },
  STORE_CHARGE: { type: 'number' },
  TRANS_CHARGE: { type: 'number' },
  CLOSE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  PK_STATUS: { type: 'string' },
  PROCESS_FLAG: { type: 'string' },
  TRN_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  SHIP_TO_ADDRESS1: { type: 'string' },
  SHIP_TO_ADDRESS2: { type: 'string' },
  SHIP_TO_ADDRESS3: { type: 'string' },
  SHIP_TO_ADDRESS4: { type: 'string' },
  OLD_LOT_NO: { type: 'string' },
  LOT_CODE: { type: 'string' },
  OUTBOUND_TYPE: { type: 'string' },
  KEYINSTART_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  OUTBOUND_REMARK: { type: 'string' },
  MHK_ETD: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  OUT_SHIP_VIA: { type: 'string' },
  MC_CODE: { type: 'string' },
  SI_NO: { type: 'string' },
  SO_REC: { type: 'string' },
  DESTINATION: { type: 'string' },
  P_EVALUATE: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATED_BY: { type: 'number' },
  PO_NO: { type: 'string' },
  PACKAGE_TYPE: { type: 'string' },
  PARENT_LOT: { type: 'string' },
  HOLD_FLAG: { type: 'string' },
  IS_URGENT: { type: 'string' },
  IS_CREATED_SO: { type: 'string' },
  SECOND_FWD: { type: 'string' },
  SECOND_FWD_ETA: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
};

export class AsnMstInterface {
  ID: number;
  CUSTOMER_CODE: string;
  BUYER_COMPANY: string;
  SELLER_COMPANY: string;
  PK_NO: string;
  PK_VERSION?: number;
  LOT_NO: string;
  DOC_DATE?: string;
  CONTRACT_NO?: string;
  SHIP_FROM?: string;
  SHIP_TO?: string;
  SHIP_TO_ADDRESS?: string;
  SHIP_TO_TEL?: string;
  SHIP_TO_FAX?: string;
  SHIP_TYPE: string;
  ATTENDANT?: string;
  SHIPPING_MARK1?: string;
  SHIPPING_MARK2?: string;
  SHIPPING_MARK3?: string;
  SHIPPING_MARK4?: string;
  SHIPPING_MARK5?: string;
  SHIPPING_MARK6?: string;
  SHIPPING_MARK7?: string;
  SHIP_VIA?: string;
  ORIGIN_SHIP_VIA?: string;
  SHIPPING_DATE?: string;
  CURRENCY?: string;
  DELIVERY_TERM?: string;
  PAYMENT_TERM?: string;
  VENDOR_CODE: string;
  VENDOR_NAME?: string;
  MBOL_NO?: string;
  TOTAL_PACKAGE?: number;
  TOTAL_PALLET?: number;
  TOTAL_CARTON?: number;
  TOTAL_QTY?: number;
  TOTAL_NET_WEIGHT?: number;
  TOTAL_GROSS_WEIGHT?: number;
  WEIGHT_UOM?: string;
  QUANTITY_UOM?: string;
  PK_DATE?: string;
  PK_TYPE: string;
  PK_KIND: string;
  EDI_FILE?: string;
  REQUEST_DATE?: string;
  RECEIVED_SNO?: string;
  RECEIVED_DATE?: string;
  RECEIVED_MH?: string;
  RECEIVED_RTS?: number;
  RECEIVED_PALLETS?: number;
  RECEIVED_CARTONS?: number;
  RECEIVED_QTY?: number;
  KEYIN_MH?: string;
  KEYINFINISH_DATE?: string;
  IQC_DATE?: string;
  IQC_CARTONS?: string;
  MHK_ETA?: string;
  TRANS_TYPE?: string;
  MATERIAL_TYPE?: string;
  FWD_CODE?: string;
  FWD_NAME?: string;
  TRANS_NO?: string;
  MAWB?: string;
  HAWB?: string;
  WAREHOUSE_CODE?: string;
  STORE_CHARGE?: number;
  TRANS_CHARGE?: number;
  CLOSE_DATE?: string;
  PK_STATUS: string;
  PROCESS_FLAG: string;
  TRN_DATE: string;
  SHIP_TO_ADDRESS1?: string;
  SHIP_TO_ADDRESS2?: string;
  SHIP_TO_ADDRESS3?: string;
  SHIP_TO_ADDRESS4?: string;
  OLD_LOT_NO: string;
  LOT_CODE?: string;
  OUTBOUND_TYPE?: string;
  KEYINSTART_DATE?: string;
  OUTBOUND_REMARK?: string;
  MHK_ETD?: string;
  OUT_SHIP_VIA?: string;
  MC_CODE?: string;
  SI_NO?: string;
  SO_REC?: string;
  DESTINATION?: string;
  P_EVALUATE?: string;
  CREATION_DATE?: string;
  LAST_UPDATE_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATED_BY?: number;
  PO_NO?: string;
  PACKAGE_TYPE?: string;
  PARENT_LOT?: string;
  HOLD_FLAG?: string;
  IS_URGENT?: string;
  IS_CREATED_SO?: string;
  SITE?: string;
  SECOND_FWD?: string;
  SECOND_FWD_ETA?: string;
}
