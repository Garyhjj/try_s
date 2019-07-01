import { EntityObject } from '../../class/entity-object.class';
export const CloseErrorRemarkObject: EntityObject = {
  tableName: 'MHUB_CLOSE_ERROR_REMARK',
  primaryKeyId: 'ID',
  seqName: 'MHUB_CLOSE_ERROR_REMARK_SEQ',
};

export const CloseErrorRemarkEntity = {
    ID: { type: 'number' },
    LOT_NO: { type: 'string' },
    REMARK: { type: 'string' },
    BUYER: { type: 'string' },
    CREATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    ATTRIBUTE: { type: 'string' },
    STATUS: { type: 'string' },
    PROCESS_METHOD: { type: 'string' },
    END_TIME: { type: 'string' },
    BUYER_EMPNO: { type: 'string' },
    CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    CREATED_BY: { type: 'number' },
    LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    LAST_UPDATED_BY: { type: 'number' },
};

export class CloseErrorRemark {
    ID: number;
    LOT_NO: string;
    REMARK: string;
    BUYER: string;
    CREATE_DATE: Date;
    ATTRIBUTE: string;
    STATUS: string;
    PROCESS_METHOD: string;
    END_TIME: string;
    BUYER_EMPNO: string;
    CREATION_DATE: Date;
    CREATED_BY: number;
    LAST_UPDATE_DATE: Date;
    LAST_UPDATED_BY: number;
}
