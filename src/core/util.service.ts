import { Database } from './../class/database.class';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class UtilService {
  constructor() {}

  getDate() {
    return moment(new Date()).format('YYYY-MM-DD');
  }

  getDatetime() {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  }

  async getTableJsonObject(tableName: string) {
    const db = new Database();
    const result = await db.execute(
      `SELECT COLUMN_NAME,DATA_TYPE FROM ALL_TAB_COLUMNS  WHERE UPPER(TABLE_NAME) = UPPER('${tableName}')
      AND OWNER='MIL' ORDER BY COLUMN_ID `,
    );
    const jsonObject: any = {};
    result.rows.forEach(element => {
      if (element.DATA_TYPE.toLocaleLowerCase() === 'date') {
        jsonObject[element.COLUMN_NAME] = {
          type: this.change(element.DATA_TYPE.toLocaleLowerCase()),
          format: 'yyyy-mm-dd hh24:mi:ss',
        };
      } else {
        jsonObject[element.COLUMN_NAME] = {
          type: this.change(element.DATA_TYPE.toLocaleLowerCase()),
        };
      }
    });

    // tslint:disable-next-line:no-console
    console.log(jsonObject);
    return jsonObject;
  }

  async getTableInterfaceString(tableName: string) {
    const db = new Database();
    const result = await db.execute(
      `SELECT COLUMN_NAME,DATA_TYPE,NULLABLE FROM ALL_TAB_COLUMNS  WHERE UPPER(TABLE_NAME) = UPPER('${tableName}')
      AND OWNER='MIL' ORDER BY COLUMN_ID `,
    );
    let interfaceString = '';
    result.rows.forEach(element => {
      if (element.NULLABLE === 'Y') {
        interfaceString += `${element.COLUMN_NAME}?: ${this.change(
          element.DATA_TYPE.toLocaleLowerCase(),
          true,
        )};`;
      } else {
        interfaceString += `${element.COLUMN_NAME}: ${this.change(
          element.DATA_TYPE.toLocaleLowerCase(),
          true,
        )};`;
      }
    });
    // tslint:disable-next-line:no-console
    return interfaceString;
  }

  change(target: string, changeDate = false) {
    if (target === 'varchar2' || target === 'VARCHAR2' || target === 'char') {
      return 'string';
    }
    if (changeDate) {
      if (target === 'date' || target === 'DATE') {
        return 'string';
      }
    }
    return target;
  }

  upperCase(s: string) {
    return typeof s === 'string' ? s.toLocaleUpperCase() : s;
  }

  dateFormat(date: any, toFormat: string, fromFormat?: string) {
    const m = moment(date, fromFormat);
    if (m.isValid()) {
      return m.format(toFormat);
    } else {
      return date;
    }
  }

  isNull(arg1: any) {
    return !arg1 && arg1 !== 0 && typeof arg1 !== 'boolean' ? true : false;
  }
}
