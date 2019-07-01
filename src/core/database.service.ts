import { isNil, isObject, nextTick } from './../shared/utils/index';
import { EntityObject } from './../class/entity-object.class';
import { DatabaseTable } from './../class/database-table.class';
import { dbConfig } from './../config/config';
import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { ConnectionController } from './../class/database-connection.class';
import * as crypto from 'crypto';
import { CacheService } from './cache.service';
import { OtherParams } from '../class';

class DbResultCache {
  data: any;
  key: string;
  resolved?: boolean;
  cacheTime: number;
}

const cryptoKey = 'yrag',
  cacheKey = 'DATABASE_MIC';
@Injectable()
export class DatabaseService {
  private dbConfig;
  private dbConfigOA;

  private ihubDb: ConnectionController;
  private oaDb: ConnectionController;
  private tableInstances: {
    name: string;
    instance: DatabaseTable;
    dbType: number;
  }[] = [];
  private defSearchParams: OtherParams = {};
  constructor(private cache: CacheService) {
    this.getDatabaseConfig();
    this.initDb();
  }

  private getDatabaseConfig() {
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
      this.dbConfig = dbConfig.productionDB;
      this.dbConfigOA = dbConfig.mioaProductionDB;
    } else {
      this.dbConfig = dbConfig.devDB;
      this.dbConfigOA = dbConfig.mioaDevDB;
    }
  }

  private initDb() {
    this.oaDb = this.oaDb || new ConnectionController(this.dbConfigOA);
    this.ihubDb = this.ihubDb || new ConnectionController(this.dbConfig);
  }

  async execute(
    sql: string,
    params: any = [],
    options: oracledb.IExecuteOptions = {
      autoCommit: true,
      outFormat: oracledb.OBJECT,
    },
    otherParams?: OtherParams,
  ) {
    const cacheTime = otherParams && otherParams.cacheTime,
      isFromSearch = !!(otherParams && otherParams.isSearch),
      canCache = cacheTime > 0 || (!cacheTime && isFromSearch);
    let cacheName;
    if (canCache) {
      cacheName = this.getCacheName(sql);
      const cache = this.getCache(cacheName);
      if (!isNil(cache)) {
        // console.log(`get cache` + new Date());
        return this.mapCache(cache);
      }
    }
    // console.log(`get db` + new Date());
    const dbPromise =
      otherParams && otherParams.switchToOA
        ? this.oaDb.execute(sql, params, options)
        : this.ihubDb.execute(sql, params, options);
    if (canCache) {
      const nCache = { data: dbPromise, cacheTime, key: cacheName };
      this.storeCache(cacheName, nCache, cacheTime);
      return this.mapCache(nCache);
    } else {
      return dbPromise;
    }
  }

  async search(sql, otherParams?: OtherParams): Promise<any[]> {
    const def = this.defSearchParams;
    otherParams = isObject(otherParams) ? otherParams : def;
    // if (!hasOwn(otherParams, 'cacheTime')) {
    //   otherParams.cacheTime = def.cacheTime;
    // }
    otherParams.isSearch = true;
    return this.execute(sql, undefined, undefined, otherParams).then(
      r => r.rows,
    );
  }

  getTableInstance(
    entityObject: EntityObject = {
      tableName: '',
      primaryKeyId: '',
      seqName: '',
    },
    entity: any = '',
    switchToOA?: boolean,
  ) {
    const dbType: number = switchToOA ? 2 : 1;
    const tableName = entityObject.tableName;
    if (tableName) {
      const table = this.tableInstances.find(
        _ => _.name === tableName && _.dbType === dbType,
      );
      if (table) {
        return table.instance;
      } else {
        const contr = switchToOA ? this.oaDb : this.ihubDb;
        const nTable = new DatabaseTable(entityObject, entity, contr);
        nTable.search = this.search.bind(this);
        nTable.execute = this.execute.bind(this);
        this.tableInstances.push({ instance: nTable, name: tableName, dbType });
        return nTable;
      }
    } else {
      return null;
    }
  }

  getCacheName(sql) {
    return crypto
      .createHmac('MD5', sql)
      .update(cryptoKey)
      .digest('hex');
  }

  clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  async mapCache(cache: DbResultCache) {
    const res = cache.data,
      key = cache.key;
    if (res && typeof res.then === 'function') {
      let out;
      await res
        .then(c => {
          out = this.clone(c);
          if (!cache.resolved) {
            cache.resolved = true;
            const hasCacheTime = !isNil(cache.cacheTime);
            if (!hasCacheTime) {
              nextTick(() => this.clearCache(key));
            }
          }
        })
        .catch(err => {
          out = null;
          this.clearCache(key);
          return Promise.reject(err);
        });
      return out;
    } else {
      return this.clone(cache);
    }
  }

  getCache(name): DbResultCache {
    return this.cache.get(cacheKey, name, false);
  }

  storeCache(name, val: DbResultCache, cacheTime) {
    this.cache.update(cacheKey, name, val, cacheTime);
  }

  clearCache(key) {
    this.cache.clear(cacheKey, key);
  }
}
