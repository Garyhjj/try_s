import { EntityObject } from 'class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const CombineSoMstObject: EntityObject = {
  tableName: 'MHUB_COMBINE_SO_MST',
  primaryKeyId: 'ID',
  seqName: 'MHUB_COMBINE_SO_MST_SEQ',
};

export const CombineSoMstEntity = {
  ID: { type: 'number' },
  CUSTOMER_CODE: { type: 'string' },
  CHINA_COMPANY_CODE: { type: 'string' },
  CHINA_COMPANY_NAME: { type: 'string' },
  COMBINE_SO_NO: { type: 'string' },
  CONTAINER_NO: { type: 'string' },
  CONTAINER_SIZE: { type: 'string' },
  ONBOARD_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CKC_SUM_SO: { type: 'number' },
  TOTAL_PALLET: { type: 'number' },
  TOTAL_CARTON: { type: 'number' },
  TOTAL_BULK_CARTON: { type: 'number' },
  TOTAL_PACKAGE: { type: 'number' },
  TOTAL_WEIGHT: { type: 'number' },
  TOTAL_MEASUREMENT: { type: 'number' },
  PROCESS_FLAG: { type: 'string' },
  ATTRIBUTE1: { type: 'string' },
  ATTRIBUTE2: { type: 'string' },
  ATTRIBUTE3: { type: 'string' },
  ATTRIBUTE4: { type: 'string' },
  ATTRIBUTE5: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class CombineSoMstInterface {
  ID: number;
  CUSTOMER_CODE: string;
  CHINA_COMPANY_CODE: string;
  CHINA_COMPANY_NAME: string;
  COMBINE_SO_NO: string;
  CONTAINER_NO: string;
  CONTAINER_SIZE?: string;
  ONBOARD_DATE: string;
  CKC_SUM_SO: number;
  TOTAL_PALLET: number;
  TOTAL_CARTON: number;
  TOTAL_BULK_CARTON: number;
  TOTAL_PACKAGE: number;
  TOTAL_WEIGHT: number;
  TOTAL_MEASUREMENT: number;
  PROCESS_FLAG: string;
  ATTRIBUTE1?: string;
  ATTRIBUTE2?: string;
  ATTRIBUTE3?: string;
  ATTRIBUTE4?: string;
  ATTRIBUTE5?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
