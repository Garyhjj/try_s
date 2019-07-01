import { EntityObject } from '../../class/entity-object.class';
export const EmpiLookupObject: EntityObject = {
  tableName: 'EMPI.EMPI_LOOKUP',
  primaryKeyId: 'ID',
  seqName: 'EMPI.EMPI_LOOKUP_SEQ',
};

export const EmpiLookupEntity = {
    ID: { type: 'number' },
    COMPANY_CODE: { type: 'string' },
    TYPE: { type: 'string' },
    CODE: { type: 'string' },
    VALUE: { type: 'string' },
    EN_DESC: { type: 'string' },
    CN_DESC: { type: 'string' },
    ENABLED: { type: 'string' },
    CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    CREATED_BY: { type: 'number' },
    LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    LAST_UPDATED_BY: { type: 'number' },
};

export class EmpiLookup {
    ID: number;
    COMPANY_CODE: string;
    TYPE: string;
    CODE: string;
    VALUE: string;
    EN_DESC: string;
    CN_DESC: string;
    ENABLED: string;
    CREATION_DATE: Date;
    CREATED_BY: number;
    LAST_UPDATE_DATE: Date;
    LAST_UPDATED_BY: number;
}
