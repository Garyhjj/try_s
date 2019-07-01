import { EntityObject } from './../../class/entity-object.class';
export const DeliveryNoticeObject: EntityObject = {
  tableName: 'mhub_delivery_notice',
  primaryKeyId: 'DELIVERY_ID',
  seqName: 'mhub_delivery_notice_SEQ',
};

export const DeliveryNoticeEntity = {
  DELIVERY_ID: { type: 'number' },
  DELIVERY_NO: { type: 'string' },
  DELIVERY_STATUS: { type: 'string' },
  VENDOR_CODE: { type: 'string' },
  VENDOR_NAME: { type: 'string' },
  LOT_NO: { type: 'string' },
  INV_NO: { type: 'string' },
  DELIVERY_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  SHIP_VIA: { type: 'string' },
  TERM_CODE: { type: 'string' },
  CONTACT: { type: 'string' },
  TEL_NO: { type: 'string' },
  FAX_NO: { type: 'string' },
  NOTI_REM: { type: 'string' },
  GOODS_NAME: { type: 'string' },
  GOODS_DESC: { type: 'string' },
  TOTAL_QTY: { type: 'number' },
  TOTAL_PALLET: { type: 'number' },
  SUB_PALLET: { type: 'number' },
  TOTAL_CARTON: { type: 'number' },
  SUB_CARTON: { type: 'number' },
  TOTAL_CARTON_UOM: { type: 'string' },
  SUB_CARTON_UOM: { type: 'string' },
  TOTAL_PALLET_UOM: { type: 'string' },
  SUB_PALLET_UOM: { type: 'string' },
  TOTAL_PACKAGE_UOM: { type: 'string' },
  PACKAGE_NO: { type: 'string' },
  WEIGHT: { type: 'number' },
  MEASURE: { type: 'number' },
  SPE_INFO: { type: 'string' },
  SPE_REMARK: { type: 'string' },
  DEPORT_NO: { type: 'string' },
  SEND_MAIL_STATUS: { type: 'string' },
  SEND_MAIL_TIME: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  MODI_RESEND_STATUS: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'string' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'string' },
  ATTRIBUTE1: { type: 'string' },
  ATTRIBUTE2: { type: 'string' },
  ATTRIBUTE3: { type: 'string' },
  ATTRIBUTE4: { type: 'string' },
  ATTRIBUTE5: { type: 'string' },
  ATTRIBUTE6: { type: 'string' },
  ATTRIBUTE7: { type: 'string' },
  ATTRIBUTE8: { type: 'string' },
  ATTRIBUTE9: { type: 'string' },
};

export class DeliveryNotice {
  DELIVERY_ID: number;
  DELIVERY_NO: string;
  DELIVERY_STATUS: string;
  VENDOR_CODE?: string;
  VENDOR_NAME?: string;
  LOT_NO: string;
  INV_NO: string;
  DELIVERY_DATE?: string;
  SHIP_VIA?: string;
  TERM_CODE?: string;
  CONTACT?: string;
  TEL_NO?: string;
  FAX_NO?: string;
  NOTI_REM?: string;
  GOODS_NAME?: string;
  GOODS_DESC?: string;
  TOTAL_QTY?: number;
  TOTAL_PALLET?: number;
  SUB_PALLET?: number;
  TOTAL_CARTON?: number;
  SUB_CARTON?: number;
  TOTAL_CARTON_UOM?: string;
  SUB_CARTON_UOM?: string;
  TOTAL_PALLET_UOM?: string;
  SUB_PALLET_UOM?: string;
  TOTAL_PACKAGE_UOM?: string;
  PACKAGE_NO?: string;
  WEIGHT: number;
  MEASURE?: number;
  SPE_INFO?: string;
  SPE_REMARK?: string;
  DEPORT_NO?: string;
  SEND_MAIL_STATUS?: string;
  SEND_MAIL_TIME?: string;
  MODI_RESEND_STATUS?: string;
  CREATION_DATE?: string;
  CREATED_BY?: string;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: string;
  ATTRIBUTE1?: string;
  ATTRIBUTE2?: string;
  ATTRIBUTE3?: string;
  ATTRIBUTE4?: string;
  ATTRIBUTE5?: string;
  ATTRIBUTE6?: string;
  ATTRIBUTE7?: string;
  ATTRIBUTE8?: string;
  ATTRIBUTE9?: string;
}
