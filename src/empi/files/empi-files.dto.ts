import { EntityObject } from '../../class/entity-object.class';
export const EmpiFilesObject: EntityObject = {
  tableName: 'EMPI.EMPI_FILES',
  primaryKeyId: 'ID',
  seqName: 'EMPI.EMPI_FILES_SEQ',
};

export const EmpiFilesEntity = {
    ID: { type: 'number' },
    COMPANY_CODE: { type: 'string' },
    FILE_NAME: { type: 'string' },
    MN_NO: { type: 'string' },
    FILE_VERSION: { type: 'number' },
    FILE_CATEGORY: { type: 'string' },
    FILE_TYPE: { type: 'string' },
    TEMP_FILE_TYPE: { type: 'string' },
    ENABLED: { type: 'string' },
    APPROVE_FLAG: { type: 'string' },
    APPROVER1: { type: 'number' },
    APPROVE_DATE1: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    APPROVER2: { type: 'number' },
    APPROVE_DATE2: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    REMARK: { type: 'string' },
    PAGE_CNT: { type: 'number' },
    FILE_PATH: { type: 'string' },
    UPLOAD_BY: { type: 'number' },
    UPLOAD_TIME: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    CREATED_BY: { type: 'number' },
    LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    LAST_UPDATED_BY: { type: 'number' },
    MAIL_GROUP: {type: 'string'},
};

export class EmpiFiles {
    ID: number;
    COMPANY_CODE: string;
    FILE_NAME: string;
    MN_NO: string;
    FILE_VERSION: number;
    FILE_CATEGORY: string;
    FILE_TYPE: string;
    TEMP_FILE_TYPE: string;
    ENABLED: string;
    APPROVE_FLAG: string;
    APPROVER1: number;
    APPROVE_DATE1: Date;
    APPROVER2: number;
    APPROVE_DATE2: Date;
    REMARK: string;
    PAGE_CNT: number;
    FILE_PATH: string;
    UPLOAD_BY: number;
    UPLOAD_TIME: Date;
    CREATION_DATE: Date;
    CREATED_BY: number;
    LAST_UPDATE_DATE: Date;
    LAST_UPDATED_BY: number;
    MAIL_GROUP: string;
}
