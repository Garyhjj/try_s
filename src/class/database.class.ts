import { EntityObject } from './entity-object.class';
import * as oracledb from 'oracledb';
import { dbConfig } from '../config/config';
import * as moment from 'moment';
import { isFunction } from 'util';

export class Database {
  dbConfig: IDbConnection;
  dbConfigOA: IDbConnection;
  constructor(
    private entityObject: EntityObject = {
      tableName: '',
      primaryKeyId: '',
      seqName: '',
    },
    private entity: any = '',
  ) {
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
      this.dbConfig = dbConfig.productionDB;
      this.dbConfigOA = dbConfig.mioaProductionDB;
    } else {
      this.dbConfig = dbConfig.devDB;
      this.dbConfigOA = dbConfig.mioaDevDB;
    }
  }

  async getConnection(switchToOA?) {
    return await oracledb.getConnection(
      switchToOA ? this.dbConfigOA : this.dbConfig,

    );
  }

  async release(conn) {
    try {
      await conn.release();
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
    }
  }

  async execute(
    sql: string,
    params: any = [],
    options: oracledb.IExecuteOptions = {
      autoCommit: true,
      outFormat: oracledb.OBJECT,
    },
    switchToOA?: boolean,
  ) {
    let conn;
    try {
      conn = await this.getConnection(switchToOA);
      return await conn.execute(sql, params, options);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);

      if (conn) {
        await this.release(conn);
      }
      throw new Error(err);
    } finally {
      if (conn) {
        await this.release(conn);
      }
    }
  }
  async search(sql) {
    return this.execute(sql).then(r => r.rows);
  }

  /**
   * 产生insert语句的sql,不需要传递 CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY栏位，自动处理
   * @param body table entity
   * @param entityObject table的一些属性，包括名字，id，seq
   * @param entity table的有效栏位，用于筛选req传递过来的无效属性，如table的栏位是id，传递过来的是id2，则忽略id2属性
   */
  insert(body: any, userId: number) {
    let result: string = `insert into ${this.entityObject.tableName} (${
      this.entityObject.primaryKeyId
      },`;
    for (const key in body) {
      if (body.hasOwnProperty(key) && this.entity[key.toUpperCase()]) {
        const k = key.toUpperCase();
        if (
          k !== 'CREATION_DATE' &&
          k !== 'CREATED_BY' &&
          k !== 'LAST_UPDATE_DATE' &&
          k !== 'LAST_UPDATED_BY' &&
          k !== this.entityObject.primaryKeyId.toUpperCase()
        ) {
          result += `${key},`;
        }
      }
    }
    // 处理CREATION_DATE CREATED_BY LAST_UPDATE_DATE LAST_UPDATED_BY
    result += `CREATION_DATE,CREATED_BY,LAST_UPDATE_DATE,LAST_UPDATED_BY`;
    result += ') values (';
    result += `${this.entityObject.seqName}.nextval,`;
    for (const key in body) {
      if (body.hasOwnProperty(key) && this.entity[key.toUpperCase()]) {
        if (
          key !== 'CREATION_DATE' &&
          key !== 'CREATED_BY' &&
          key !== 'LAST_UPDATE_DATE' &&
          key !== 'LAST_UPDATED_BY' &&
          key !== this.entityObject.primaryKeyId
        ) {
          if (this.entity[key.toUpperCase()].type === 'date') {
            // result += `to_date('${body[key]}','${
            //   this.entity[key.toUpperCase()].format
            // }'),`;
            if (body[key]) {
              result += `  to_date('${body[key]}','${
                this.entity[key.toUpperCase()].format
                }'),`;
            } else {
              result += `'',`;
            }
          } else {
            // result += `'${body[key.toUpperCase()]}',`;
            if (body[key.toUpperCase()] || body[key.toUpperCase()] === 0) {
              result += ` '${body[key.toUpperCase()]}',`;
            } else {
              result += ` '',`;
            }
          }
        }
      }
    }
    // 处理CREATION_DATE CREATED_BY LAST_UPDATE_DATE LAST_UPDATED_BY
    result += `to_date('${moment(new Date()).format(
      'YYYY-MM-DD HH:mm:ss',
    )}','yyyy-mm-dd hh24:mi:ss'),${userId},
    to_date('${moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss',
      )}','yyyy-mm-dd hh24:mi:ss'),${userId} )`;

    return this.execute(result);
  }

  /**
   * 产生update语句的sql
   * @param body table entity
   * @param entityObject table的一些属性，包括名字，id，seq
   * @param entity table的有效栏位，用于筛选req传递过来的无效属性，如table的栏位是id，传递过来的是id2，则忽略id2属性
   */
  update(body: any, userId: number) {
    let result: string = `update  ${this.entityObject.tableName} set `;

    // 当req传递的参数没有LAST_UPDATE_DATE时自动更新LAST_UPDATE_DATE为当前时间
    if (!body.columns.hasOwnProperty('LAST_UPDATE_DATE')) {
      body.columns.LAST_UPDATE_DATE = moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss',
      );
    }

    // 当req传递的参数没有LAST_UPDATED_BY时自动更新LAST_UPDATED_BY为当前登陆人
    if (!body.columns.hasOwnProperty('LAST_UPDATED_BY')) {
      body.columns.LAST_UPDATED_BY = userId;
    }

    for (const key in body.columns) {
      if (body.columns.hasOwnProperty(key) && this.entity[key.toUpperCase()]) {
        if (this.entity[key.toUpperCase()].type === 'date') {
          const date = moment(body.columns[key]).format('YYYY-MM-DD HH:mm:ss');
          if (body.columns[key]) {
            result += `${key} =  to_date('${date}','${
              this.entity[key.toUpperCase()].format
              }'),`;
          } else {
            result += `${key} ='',`;
          }
        } else {
          if (body.columns[key] !== void 0 && body.columns[key] !== null) {
            result += `${key} = '${body.columns[key]}',`;
          } else {
            result += `${key} = '',`;
          }
        }
      }
    }
    // LAST_UPDATE_DATE LAST_UPDATED_BY
    // result += `LAST_UPDATE_DATE=to_date('${this.getDatetime()}','yyyy-mm-dd hh24:mi:ss'),`;
    // result += `LAST_UPDATED_BY=${userId} `;
    // 去掉末尾逗号
    result = result.substr(
      0,
      result.lastIndexOf(',') > -1 ? result.lastIndexOf(',') : result.length,
    );
    result += ` where `;
    for (const key in body.where) {
      if (body.where.hasOwnProperty(key) && this.entity[key.toUpperCase()]) {
        result += `${key} = '${body.where[key]}' and `;
      }
    }

    // 去掉末尾的end
    result = result.substr(
      0,
      result.lastIndexOf('and ') > -1
        ? result.lastIndexOf('and ')
        : result.length,
    );
    return this.execute(result);
  }

  delete(body: any) {
    let result: string = `delete from   ${this.entityObject.tableName} where  `;
    for (const key in body.where) {
      if (body.where.hasOwnProperty(key) && this.entity[key.toUpperCase()]) {
        result += `${key} = '${body.where[key]}' and `;
      }
    }
    // 去掉末尾的end
    result = result.substr(
      0,
      result.lastIndexOf('and ') > -1
        ? result.lastIndexOf('and ')
        : result.length,
    );
    return this.execute(result);
  }

  deleteById(id: number) {
    const result: string = `delete from   ${
      this.entityObject.tableName
      } where ${this.entityObject.primaryKeyId}=${id} `;
    return this.execute(result);
  }

  // 具有分页功能
  find(filter: any, pi = 1, ps = 10) {
    let orderBy: string;
    // 获取分页和order by条件
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        if (key.toLocaleLowerCase() === 'pi') {
          if (!isNaN(filter[key])) {
            pi = filter[key];
          }
        }
        if (key.toLocaleLowerCase() === 'ps') {
          if (!isNaN(filter[key])) {
            ps = filter[key];
          }
        }
        if (key.toLocaleLowerCase() === 'orderby') {
          if (filter[key]) {
            orderBy = filter[key];
          }
        }
      }
    }

    let result: string = `SELECT *  FROM (SELECT A.*, ROWNUM RN FROM ( select * from  ${
      this.entityObject.tableName
      } `;
    let count = 1;
    // 去除无效属性
    for (const key in filter) {
      if (
        filter.hasOwnProperty(key) &&
        this.entity[key.toUpperCase()] &&
        filter[key]
      ) {
        if (count <= 1) {
          result = result + ' where ';
        }
        result += `${key} = '${filter[key]}' and `;
        count++;
      }
    }
    // 去掉末尾的end
    result = result.substr(
      0,
      result.lastIndexOf('and ') > -1
        ? result.lastIndexOf('and ')
        : result.length,
    );
    // order by
    if (orderBy) {
      result += 'order by ' + orderBy;
    }
    // 分页功能
    result += `) A WHERE ROWNUM <=  ${pi * ps}) WHERE RN >= ${(pi - 1) * ps +
      1}`;
    return this.execute(result);
  }

  async insert2(body: any, userId: number, opts?: any) {
    const id = await this.execute(
      `select ${this.entityObject.seqName}.nextVal from dual`,
    ).then(res => res.rows[0].NEXTVAL);
    let result: string = `insert into ${this.entityObject.tableName} (${
      this.entityObject.primaryKeyId
      },`;
    body[this.entityObject.primaryKeyId] = id;
    if (opts && isFunction(opts.beforeUpdate)) {
      body = opts.beforeUpdate(body);
    }
    for (const key in body) {
      if (body.hasOwnProperty(key) && this.entity[key.toUpperCase()]) {
        const k = key.toUpperCase();
        if (
          k !== 'CREATION_DATE' &&
          k !== 'CREATED_BY' &&
          k !== 'LAST_UPDATE_DATE' &&
          k !== 'LAST_UPDATED_BY' &&
          k !== this.entityObject.primaryKeyId.toUpperCase()
        ) {
          result += `${key},`;
        }
      }
    }
    // 处理CREATION_DATE CREATED_BY LAST_UPDATE_DATE LAST_UPDATED_BY
    result += `CREATION_DATE,CREATED_BY,LAST_UPDATE_DATE,LAST_UPDATED_BY`;
    result += ') values (';
    result += `${id},`;
    for (const key in body) {
      if (body.hasOwnProperty(key) && this.entity[key.toUpperCase()]) {
        if (
          key !== 'CREATION_DATE' &&
          key !== 'CREATED_BY' &&
          key !== 'LAST_UPDATE_DATE' &&
          key !== 'LAST_UPDATED_BY' &&
          key !== this.entityObject.primaryKeyId
        ) {
          if (this.entity[key.toUpperCase()].type === 'date') {
            // result += `to_date('${body[key]}','${
            //   this.entity[key.toUpperCase()].format
            // }'),`;
            if (body[key]) {
              result += `  to_date('${moment(body[key]).format(
                'YYYY-MM-DD HH:mm:ss',
              )}','${this.entity[key.toUpperCase()].format}'),`;
            } else {
              result += `'',`;
            }
          } else {
            // result += `'${body[key.toUpperCase()]}',`;
            if (body[key.toUpperCase()]) {
              result += ` '${body[key.toUpperCase()]}',`;
            } else {
              result += ` '',`;
            }
          }
        }
      }
    }
    // 处理CREATION_DATE CREATED_BY LAST_UPDATE_DATE LAST_UPDATED_BY
    result += `to_date('${moment(new Date()).format(
      'YYYY-MM-DD HH:mm:ss',
    )}','yyyy-mm-dd hh24:mi:ss'),${userId},
    to_date('${moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss',
      )}','yyyy-mm-dd hh24:mi:ss'),${userId} )`;
    return this.execute(result).then(() => id);
  }
}

interface IDbConnection {
  user: string;
  password: string;
  connectString: string;
}
