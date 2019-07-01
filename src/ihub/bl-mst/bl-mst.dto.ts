import { EntityObject } from 'class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const BlMstObject: EntityObject = {
  tableName: 'MHUB_BL_MST',
  primaryKeyId: 'ID',
  seqName: 'MHUB_BL_MST_SEQ',
};

export const BlMstEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  MAWB: { type: 'string' },
  HAWB: { type: 'string' },
  SHIP_VIA: { type: 'string' },
  CONSIGNEE_PARTY: { type: 'string' },
  CONSIGNEE_WINDOW: { type: 'string' },
  CONSIGNEE_PHONE: { type: 'string' },
  CONSIGNEE_ADDRESS: { type: 'string' },
  SHIPPER: { type: 'string' },
  SHIPPER_WINDOW: { type: 'string' },
  SHIPPER_PHONE: { type: 'string' },
  SHIPPER_ADDRESS: { type: 'string' },
  NOTIFY_PARTY: { type: 'string' },
  NOTIFY_PHONE: { type: 'string' },
  NOTIFY_WINDOW: { type: 'string' },
  NOTIFY_ADDRESS: { type: 'string' },
  PAYMENT_TERM: { type: 'string' },
  TOTAL_VOLUME: { type: 'number' },
  TOTAL_WEIGHT: { type: 'number' },
  WEIGHT_UOM: { type: 'string' },
  TOTAL_CARTON: { type: 'number' },
  TOTAL_PALLET: { type: 'number' },
  FWD_CODE: { type: 'string' },
  FWD_NAME: { type: 'string' },
  FLIGHT_NO: { type: 'string' },
  TRANSPORT_NO: { type: 'string' },
  DEPARTURE_CODE: { type: 'string' },
  ARRIVAL_CODE: { type: 'string' },
  DEPARTURE_TIME: { type: 'string' },
  ARRIVAL_TIME: { type: 'string' },
  QUOTATION_NO: { type: 'string' },
  QUOTATION_VERSION: { type: 'string' },
  PIC_CODE: { type: 'string' },
  PIC_NAME: { type: 'string' },
  CONTAINER_AMT: { type: 'number' },
  CONTAINER_SIZE: { type: 'string' },
  CONTAINER_NO: { type: 'string' },
  SEAL_NO: { type: 'string' },
  REMARK: { type: 'string' },
  TRN_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CHECK_SUM_LOT: { type: 'number' },
  PROCESS_FLAG: { type: 'string' },
  BL_STATUS: { type: 'string' },
  DELIVERY_TERM: { type: 'string' },
  ONBOARD_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LOT_NO: { type: 'string' },
  INV_NO: { type: 'string' },
  SO_NO: { type: 'string' },
  TRUCK_TON: { type: 'string' },
  CARRIER_CODE: { type: 'string' },
  CHECK_SUM_CONTAINER: { type: 'string' },
  TOTAL_QTY: { type: 'number' },
  BULK_CARTON: { type: 'number' },
  FWD_INV_NO: { type: 'string' },
  CONFIRM_USER: { type: 'string' },
  CONFIRM_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  ATTRIBUTE6: { type: 'string' },
  EDI_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  ATTRIBUTE7: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class BlMstInterface {
  ID: number;
  CUSTOMER_CODE: string;
  SELLER_COMPANY: string;
  BUYER_COMPANY: string;
  MAWB: string;
  HAWB: string;
  SHIP_VIA: string;
  CONSIGNEE_PARTY: string;
  CONSIGNEE_WINDOW?: string;
  CONSIGNEE_PHONE?: string;
  CONSIGNEE_ADDRESS?: string;
  SHIPPER: string;
  SHIPPER_WINDOW?: string;
  SHIPPER_PHONE?: string;
  SHIPPER_ADDRESS?: string;
  NOTIFY_PARTY: string;
  NOTIFY_PHONE?: string;
  NOTIFY_WINDOW?: string;
  NOTIFY_ADDRESS?: string;
  PAYMENT_TERM?: string;
  TOTAL_VOLUME?: number;
  TOTAL_WEIGHT?: number;
  WEIGHT_UOM?: string;
  TOTAL_CARTON: number;
  TOTAL_PALLET: number;
  FWD_CODE: string;
  FWD_NAME?: string;
  FLIGHT_NO?: string;
  TRANSPORT_NO?: string;
  DEPARTURE_CODE?: string;
  ARRIVAL_CODE?: string;
  DEPARTURE_TIME?: string;
  ARRIVAL_TIME?: string;
  QUOTATION_NO?: string;
  QUOTATION_VERSION?: string;
  PIC_CODE?: string;
  PIC_NAME?: string;
  CONTAINER_AMT?: number;
  CONTAINER_SIZE?: string;
  CONTAINER_NO?: string;
  SEAL_NO?: string;
  REMARK?: string;
  TRN_DATE?: string;
  CHECK_SUM_LOT?: number;
  PROCESS_FLAG?: string;
  BL_STATUS?: string;
  DELIVERY_TERM?: string;
  ONBOARD_DATE?: string;
  LOT_NO?: string;
  INV_NO?: string;
  SO_NO?: string;
  TRUCK_TON?: string;
  CARRIER_CODE?: string;
  CHECK_SUM_CONTAINER?: string;
  TOTAL_QTY?: number;
  BULK_CARTON?: number;
  FWD_INV_NO?: string;
  CONFIRM_USER?: string;
  CONFIRM_DATE?: string;
  ATTRIBUTE6?: string;
  EDI_DATE?: string;
  ATTRIBUTE7?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
  CSNOLIST?: string;
  BLNOLIST?: string;
}
