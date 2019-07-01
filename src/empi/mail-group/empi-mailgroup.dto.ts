import { EntityObject } from '../../class/entity-object.class';
export const EmpiMailgroupObject: EntityObject = {
  tableName: 'EMPI.EMPI_MAILGROUP',
  primaryKeyId: 'ID',
  seqName: 'EMPI.EMPI_MAILGROUP_SEQ',
};

export const EmpiMailgroupEntity = {
    ID: { type: 'number' },
    COMPANY_CODE: { type: 'string' },
    MAIL_ADDRESS: { type: 'string' },
    CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    CREATED_BY: { type: 'number' },
    LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    LAST_UPDATED_BY: { type: 'number' },
};

export class EmpiMailgroup {
    ID: number;
    COMPANY_CODE: string;
    MAIL_ADDRESS: string;
    CREATION_DATE: Date;
    CREATED_BY: number;
    LAST_UPDATE_DATE: Date;
    LAST_UPDATED_BY: number;
}
