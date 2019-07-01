import { EntityObject } from '../../class/entity-object.class';
export const EmpiFileRelationObject: EntityObject = {
  tableName: 'EMPI.EMPI_FILE_RELATION',
  primaryKeyId: 'ID',
  seqName: 'EMPI.EMPI_FILE_RELATION_SEQ',
};

export const EmpiFileRelationEntity = {
    ID: { type: 'number' },
    COMPANY_CODE: { type: 'string' },
    OPERATION_CODE: { type: 'string' },
    LINE: { type: 'string' },
    PART_NO: { type: 'string' },
    MODEL: { type: 'string' },
    CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    CREATED_BY: { type: 'number' },
    LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
    LAST_UPDATED_BY: { type: 'number' },
    FILE_ID: { type: 'number' },
    FAMILY_NAME : {type: 'FAMILY_NAME'},
};

export class EmpiFileRelation {
    ID: number;
    COMPANY_CODE: string;
    OPERATION_CODE: string;
    LINE: string;
    PART_NO: string;
    MODEL: string;
    CREATION_DATE: Date;
    CREATED_BY: number;
    LAST_UPDATE_DATE: Date;
    LAST_UPDATED_BY: number;
    FILE_ID: number;
    FAMILY_NAME: string;
}
