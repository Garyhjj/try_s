import { EntityObject } from './../../class/entity-object.class';

/**
 * (require) DB Object的关键信息
 */
export const ControlPartObject: EntityObject = {
  tableName: 'MHUB_CONTROL_PARTS',
  primaryKeyId: 'ID',
  seqName: 'MHUB_CONTROL_PARTS_SEQ',
};

export const ControlPartEntity = { ID: { type: 'number' },
MITAC_PN: { type: 'string' },
MODEL_OR_PN: { type: 'string' },
LICENCE_NO: { type: 'string' },
PRE_CLASS: { type: 'string' },
CCATS: { type: 'string' },
REMARK: { type: 'string' },
EXIT_LICENCE: { type: 'string' },
CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
CREATED_BY: { type: 'number' },
LAST_UPDATE_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
LAST_UPDATED_BY: { type: 'number' } };

export class ControlPartInterface {
  ID: number;
  MITAC_PN: string;
  MODEL_OR_PN?: string;
  LICENCE_NO?: string;
  PRE_CLASS?: string;
  CCATS?: string;
  REMARK?: string;
  EXIT_LICENCE?: string;
  CREATION_DATE?: string;
  CREATED_BY?: number;
  LAST_UPDATE_DATE?: string;
  LAST_UPDATED_BY?: number;
}
