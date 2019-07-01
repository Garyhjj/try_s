import { EntityObject } from './../../class/entity-object.class';
export const DataDriveObject: EntityObject = {
  tableName: 'MIL_DATA_DRIVE_SETTING',
  primaryKeyId: 'ID',
  seqName: 'MIL_DATA_DRIVE_SETTING_SEQ',
};

export const DataDriveEntity = {
  ID: { type: 'number' },
  DESCRIPTION: { type: 'string' },
  MAIN_SET: { type: 'string' },
  TABLE_DATA: { type: 'string' },
  SEARCH_SETS: { type: 'string' },
  UPDATE_SETS: { type: 'string' },
  CREATION_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  CREATION_BY: { type: 'number' },
  LAST_UPDATED_DATE: { type: 'date', format: 'yyyy-mm-dd hh24:mi:ss' },
  LAST_UPDATED_BY: { type: 'number' },
  LAST_UPDATE_LOGIN: { type: 'number' },
};

export class DataDriveInterface {
  ID: number;
  DESCRIPTION?: string;
  MAIN_SET?: string;
  TABLE_DATA?: string;
  SEARCH_SETS?: string;
  UPDATE_SETS?: string;
  CREATION_DATE?: string;
  CREATION_BY?: number;
  LAST_UPDATED_DATE?: string;
  LAST_UPDATED_BY?: number;
  LAST_UPDATE_LOGIN?: number;
}
