import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const SoMstObject: EntityObject = {
  tableName: 'MHUB_SO_MST',
  primaryKeyId: 'ID',
  seqName: 'MHUB_SO_MST_SEQ',
};

export const SoMstEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  SO_NO: { type: 'string' },
  VERSION: { type: 'number' },
  LOT_NO: { type: 'string' },
  INV_NO: { type: 'string' },
  SHIPPER: { type: 'string' },
  CONSIGNEE_NO: { type: 'string' },
  DEPOT_NO: { type: 'string' },
  FWD_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  VENDOR_NO: { type: 'string' },
  SHIP_VIA: { type: 'string' },
  INV_AMOUNT: { type: 'number' },
  TOTAL_QTY: { type: 'number' },
  FREIGHT_PAY_AT: { type: 'string' },
  LOAD_PORT: { type: 'string' },
  DISCH_PORT: { type: 'string' },
  DELIV_PLA: { type: 'string' },
  SHIP_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  INSTO_NO: { type: 'string' },
  INSTO_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  OUTSTO_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  GOODS: { type: 'string' },
  TOTAL_PALLET: { type: 'number' },
  TOTAL_CARTON: { type: 'number' },
  PACKAGE_NO: { type: 'string' },
  WEIGHT: { type: 'number' },
  MEASURE: { type: 'number' },
  MAWB: { type: 'string' },
  HAWB: { type: 'string' },
  FLT_NO: { type: 'string' },
  SPE_INFO: { type: 'string' },
  NOTI_REM: { type: 'string' },
  SO_STATUS: { type: 'string' },
  VENDOR_SO: { type: 'string' },
  SO_FLAG: { type: 'string' },
  USER_CODE: { type: 'string' },
  BU: { type: 'string' },
  SERVICE_REQUIRED: { type: 'string' },
  CONTACT: { type: 'string' },
  TEL_NO: { type: 'string' },
  FAX_NO: { type: 'string' },
  TRN_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  VENDOR_NAME: { type: 'string' },
  LOT_FLAG: { type: 'string' },
  CARTON_1: { type: 'number' },
  CONNECT_FWD: { type: 'string' },
  SPE_REMARK: { type: 'string' },
  INHK_SHIP_VIA: { type: 'string' },
  TOTAL_CARTON_UOM: { type: 'string' },
  CONNECT_FWD_CODE: { type: 'string' },
  FIRST_FWD_WEIGHT: { type: 'number' },
  FIRST_FWD_MEASURE: { type: 'number' },
  FLT_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CONTAINER_NO: { type: 'string' },
  CONTAINER_TYPE: { type: 'string' },
  SHIP_FROM: { type: 'string' },
  SHIP_TO: { type: 'string' },
  SIGN_FLAG: { type: 'string' },
  SIGN_MSG: { type: 'string' },
  SIGN_STATUS: { type: 'string' },
  SHIPPING_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
  ATTRIBUTE1: { type: 'string' },
  ATTRIBUTE2: { type: 'string' },
  ATTRIBUTE3: { type: 'string' },
  ATTRIBUTE4: { type: 'string' },
  ATTRIBUTE5: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  ATTRIBUTE6: { type: 'string' },
  ATTRIBUTE7: { type: 'string' },
  ATTRIBUTE8: { type: 'string' },
  ATTRIBUTE9: { type: 'string' },
  ATTRIBUTE10: { type: 'string' },
  ATTRIBUTE11: { type: 'string' },
  ATTRIBUTE12: { type: 'string' },
  ATTRIBUTE13: { type: 'string' },
  PK_PART_NO: { type: 'string' },
  PK_QTY: { type: 'string' },
  ASN_DTL_ID: { type: 'string' },
};

export class SoMstInterface {
  ID: number;
  CUSTOMER_CODE: string;
  SELLER_COMPANY: string;
  BUYER_COMPANY: string;
  SO_NO: string;
  VERSION?: number;
  LOT_NO: string;
  INV_NO: string;
  SHIPPER: string;
  CONSIGNEE_NO: string;
  DEPOT_NO: string;
  FWD_DATE?: string;
  VENDOR_NO?: string;
  SHIP_VIA: string;
  INV_AMOUNT: number;
  TOTAL_QTY?: number;
  FREIGHT_PAY_AT?: string;
  LOAD_PORT?: string;
  DISCH_PORT?: string;
  DELIV_PLA?: string;
  SHIP_DATE?: string;
  INSTO_NO?: string;
  INSTO_DATE?: string;
  OUTSTO_DATE?: string;
  GOODS?: string;
  TOTAL_PALLET: number;
  TOTAL_CARTON: number;
  PACKAGE_NO: string;
  WEIGHT?: number;
  MEASURE?: number;
  MAWB?: string;
  HAWB?: string;
  FLT_NO?: string;
  SPE_INFO?: string;
  NOTI_REM?: string;
  SO_STATUS: string;
  VENDOR_SO?: string;
  SO_FLAG: string;
  USER_CODE: string;
  BU: string;
  SERVICE_REQUIRED?: string;
  CONTACT?: string;
  TEL_NO?: string;
  FAX_NO?: string;
  TRN_DATE: string;
  VENDOR_NAME: string;
  LOT_FLAG: string;
  CARTON_1: number;
  CONNECT_FWD?: string;
  SPE_REMARK?: string;
  INHK_SHIP_VIA?: string;
  TOTAL_CARTON_UOM?: string;
  CONNECT_FWD_CODE?: string;
  FIRST_FWD_WEIGHT?: number;
  FIRST_FWD_MEASURE?: number;
  FLT_DATE?: string;
  CONTAINER_NO?: string;
  CONTAINER_TYPE?: string;
  SHIP_FROM?: string;
  SHIP_TO?: string;
  SIGN_FLAG?: string;
  SIGN_MSG?: string;
  SIGN_STATUS?: string;
  SHIPPING_DATE?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
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
  PK_PART_NO?: string;
  PK_QTY?: string;
  ASN_DTL_ID?: string;
}
