import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const UrgentShipmentObject: EntityObject = {
  tableName: 'mhub_urgent_shipment',
  primaryKeyId: 'ID',
  seqName: 'mhub_urgent_shipment_SEQ',
};
export const UrgentShipmentEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  SELLER_COMPANY: { type: 'string' },
  BUYER_COMPANY: { type: 'string' },
  DOC_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LOT_NO: { type: 'string' },
  ORG_CODE: { type: 'string' },
  SHIP_VIA: { type: 'string' },
  USER_CODE: { type: 'string' },
  USER_NAME: { type: 'string' },
  URGENT_STATE_CODE: { type: 'string' },
  URGENT_STATE_NAME: { type: 'string' },
  INRQ_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  INMSL_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  PROCESS_FLAG: { type: 'string' },
  TRN_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  ATTRIBUTE1: { type: 'string' },
  ATTRIBUTE2: { type: 'string' },
  ATTRIBUTE3: { type: 'string' },
  ATTRIBUTE4: { type: 'string' },
  ATTRIBUTE5: { type: 'string' },
  ATTRIBUTE6: { type: 'string' },
  OUT_WAREHOUSE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  ETD_HK_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  M_TYPE: { type: 'string' },
  PLAN_TOMSL_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  TO_DOCK_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  OUTSPAN_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  TO_IO_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CHACK_END_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  QC_TYPE: { type: 'string' },
  QC_REMARK: { type: 'string' },
  QC_REC_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class UrgentShipment {
  ID: number;
  CUSTOMER_CODE: string;
  SELLER_COMPANY: string;
  BUYER_COMPANY: string;
  DOC_DATE: string;
  LOT_NO?: string;
  ORG_CODE: string;
  SHIP_VIA: string;
  USER_CODE: string;
  USER_NAME: string;
  URGENT_STATE_CODE: string;
  URGENT_STATE_NAME: string;
  INRQ_DATE?: string;
  INMSL_DATE: string;
  PROCESS_FLAG: string;
  TRN_DATE: string;
  ATTRIBUTE1?: string;
  ATTRIBUTE2?: string;
  ATTRIBUTE3?: string;
  ATTRIBUTE4?: string;
  ATTRIBUTE5?: string;
  ATTRIBUTE6?: string;
  OUT_WAREHOUSE_DATE?: string;
  ETD_HK_DATE?: string;
  M_TYPE?: string;
  PLAN_TOMSL_DATE?: string;
  TO_DOCK_DATE?: string;
  OUTSPAN_DATE?: string;
  TO_IO_DATE?: string;
  CHACK_END_DATE?: string;
  QC_TYPE?: string;
  QC_REMARK?: string;
  QC_REC_DATE?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
