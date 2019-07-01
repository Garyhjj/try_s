import { EntityObject } from '../../class/entity-object.class';
export const ReceivedWhDateObject: EntityObject = {
  tableName: 'MHUB_RECEIVED_WH_DATE',
  primaryKeyId: 'ID',
  seqName: 'MHUB_RECEIVED_WH_DATE_SEQ',
};

export const ReceivedWhDateEntity = {
    ID: { type: 'number' },
    CUSTOMER_CODE: { type: 'string' },
    SELLER_COMPANY: { type: 'string' },
    BUYER_COMPANY: { type: 'string' },
    IN_LOT_NO: { type: 'string' },
    OUT_LOT_NO: { type: 'string' },
    TOTAL_PALLET: { type: 'number' },
    TOTAL_CARTON: { type: 'number' },
    SHIP_VIA: { type: 'string' },
    RECEIVED_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    MHK_ETD: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    ATTRIBUTE1: { type: 'string' },
    HAWB: { type: 'string' },
    PK_NO: { type: 'string' },
    ATTRIBUTE2: { type: 'string' },
    UPLOAD_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    AREA: { type: 'string' },
    VENDOR_NAME: { type: 'string' },
    CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    CREATED_BY: { type: 'number' },
    LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    LAST_UPDATED_BY: { type: 'number' },
};

export class ReceivedWhDate {
    ID: number;
    CUSTOMER_CODE: string;
    SELLER_COMPANY: string;
    BUYER_COMPANY: string;
    IN_LOT_NO: string;
    OUT_LOT_NO: string;
    TOTAL_PALLET: number;
    TOTAL_CARTON: number;
    SHIP_VIA: string;
    RECEIVED_DATE: Date;
    MHK_ETD: Date;
    ATTRIBUTE1: string;
    HAWB: string;
    PK_NO: string;
    ATTRIBUTE2: string;
    UPLOAD_DATE: Date;
    AREA: string;
    VENDOR_NAME: string;
    CREATION_DATE: Date;
    CREATED_BY: number;
    LAST_UPDATE_DATE: Date;
    LAST_UPDATED_BY: number;
}
