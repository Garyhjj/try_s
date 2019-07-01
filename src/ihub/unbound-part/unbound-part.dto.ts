import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const UnboundPartObject: EntityObject = {
  tableName: 'MHUB_UNBOUND_PART',
  primaryKeyId: 'ID',
  seqName: 'MHUB_UNBOUND_PART_SEQ',
};

export const UnboundPartEntity = {
  ID: { type: 'number' },
  PART_NO: { type: 'string' },
  VENDOR_NAME: { type: 'string' },
  CUSTOM_DUTY: { type: 'number' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATED_BY: { type: 'number' },
  LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
};

export class UnboundPartInterface {
  ID: number;
  PART_NO?: string;
  VENDOR_NAME?: string;
  CUSTOM_DUTY?: number;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
