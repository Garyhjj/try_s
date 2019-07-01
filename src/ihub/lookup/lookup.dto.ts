import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const LookupObject: EntityObject = {
  tableName: 'MIL_LOOKUP_VALUES_ALL',
  primaryKeyId: 'ID',
  seqName: 'MIL_LOOKUP_VALUES_SEQ',
};

export const LookupEntity = {
  ID: { type: 'number' },
  LOOKUP_TYPE: { type: 'string' },
  LOOKUP_CODE: { type: 'string' },
  LOOKUP_LABEL: { type: 'string' },
  DESCRIPTION: { type: 'string' },
  ENABLED_FLAG: { type: 'string' },
  START_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  END_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  COMPANY_ID: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class LookupInterface {
  ID: number;
  LOOKUP_TYPE: string;
  LOOKUP_CODE: string;
  DESCRIPTION?: string;
  ENABLED_FLAG?: string;
  START_DATE?: string;
  END_DATE?: string;
  COMPANY_ID?: string;
  CREATION_DATE?: string;
  LAST_UPDATE_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATED_BY?: number;
}
