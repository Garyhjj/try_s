import * as oracledb from 'oracledb';
import * as child_process from 'child_process';
import { resolve } from 'path';

const processPath = resolve(__dirname, '../../lib/db-child.js');
class Connection {
  private _executingCount = 0;

  private connection: oracledb.IConnection;

  private freeCheckTimeId: NodeJS.Timer;

  private promiseCache: Promise<any>;
  private maxExecuteTime = 1000 * 30;
  private child: child_process.ChildProcess;
  private reqList: {
    id: number;
    resolve: (res: any) => void;
    reject: (err: any) => void;
    done?: boolean;
  }[] = [];
  private id = 1;
  constructor(private dbConfig: oracledb.IConnectionAttributes) {}

  get executingCount() {
    return this._executingCount;
  }

  async connect() {
    if (!this.promiseCache || !this.child || !this.child.connected) {
      const child = child_process.fork(processPath);
      child.on('message', ({ id, res, err }) => {
        if (id) {
          const tar = this.reqList.find(_ => _.id === id);
          if (tar) {
            if (err) {
              tar.reject(err);
            } else {
              tar.resolve(res);
            }
            tar.done = true;
          }
        }
      });
      child.on('error', e => {
        this.release();
      });
      const id = this.id++;
      this.child = child;
      this.promiseCache = new Promise((resolve, reject) => {
        this.reqList.push({
          id,
          resolve,
          reject,
        });
        child.send({
          id,
          type: 1,
          params: this.dbConfig,
        });
      });
    }
    await this.promiseCache;
  }
  reduceReqList() {
    const a = this.id / 50;
    if (a === Math.floor(a)) {
      this.reqList = this.reqList.filter(_ => !_.done);
    }
  }
  private async _execute(...params) {
    await this.connect();
    if (this.id > 100000000) {
      this.id = 1;
    }
    const id = this.id++;
    this.reduceReqList();
    return new Promise((resolve, reject) => {
      this.reqList.push({
        id,
        resolve,
        reject,
      });
      this.child.send({
        id,
        type: 2,
        params,
      });
    });
  }

  async release() {
    if (this.child) {
      const child = this.child;
      this.child = null;
      child.disconnect();
    }
  }

  async execute(
    sql: string,
    params: any = [],
    options: oracledb.IExecuteOptions = {
      autoCommit: true,
      outFormat: oracledb.OBJECT,
    },
  ): Promise<{
    rows?: any[];
    metaData: { name: string }[];
    rowsAffected: any;
  }> {
    this._executingCount++;
    this.clearFreeCheckTimeout();
    return (await new Promise((resovle, reject) => {
      let hasDone, isOutTime;
      setTimeout(() => {
        if (!hasDone) {
          isOutTime = true;
          this.finishOneSql();
          reject('执行超时');
        }
      }, this.maxExecuteTime);
      this._execute(sql, params, options)
        .then(res => {
          if (isOutTime) {
            return;
          }
          hasDone = true;
          this.finishOneSql();
          resovle(res);
        })
        .catch(err => {
          if (isOutTime) {
            return;
          }
          hasDone = true;
          this.finishOneSql();
          this.release();
          reject(err);
        });
    })) as Promise<{
      rows?: any[];
      metaData: { name: string }[];
      rowsAffected: any;
    }>;
  }

  private finishOneSql() {
    this._executingCount = Math.max(0, this._executingCount - 1);
    this.doFreeCheck();
  }

  private doFreeCheck() {
    if (this._executingCount === 0) {
      this.freeCheckTimeId = setTimeout(() => {
        this.freeCheckTimeId = null;
        this.release();
      }, 60 * 1000 * 30);
    } else {
      this.clearFreeCheckTimeout();
    }
  }

  private clearFreeCheckTimeout() {
    if (this.freeCheckTimeId) {
      clearTimeout(this.freeCheckTimeId);
      this.freeCheckTimeId = null;
    }
  }
}

export class ConnectionController {
  private connections: Connection[] = [];

  private maxConnections = 5;
  private maxOneExecutingCount = 3;
  private busyConnections: Connection[] = [];

  constructor(private dbConfig: oracledb.IConnectionAttributes) {}

  private initConnection() {
    return new Connection(this.dbConfig);
  }

  private getConnection(isBusy?) {
    const connections = isBusy ? this.busyConnections : this.connections;
    const lg = connections.length;
    if (lg === 0) {
      const con = this.initConnection();
      connections.push(con);
      return con;
    } else {
      connections.sort((a, b) => a.executingCount - b.executingCount);
      // console.log(connections.map(_ => _.executingCount));
      let tarCon: Connection;
      for (let i = lg - 1; i > -1; i--) {
        const c = connections[i];
        if (c.executingCount < this.maxOneExecutingCount) {
          tarCon = c;
          break;
        }
      }
      tarCon = tarCon || connections[0];
      if (
        tarCon.executingCount >= this.maxOneExecutingCount &&
        lg < this.maxConnections
      ) {
        const con = this.initConnection();
        connections.push(con);
        return con;
      } else {
        return tarCon;
      }
    }
  }

  async execute(
    sql: string,
    params: any = [],
    options: oracledb.IExecuteOptions = {
      autoCommit: true,
      outFormat: oracledb.OBJECT,
    },
    otherParams: { isBusy?: boolean } = { isBusy: false },
  ) {
    const con = this.getConnection(otherParams.isBusy);
    return con.execute(sql, params, options);
  }
}

// const dbConfig = this.dbConfig;
// let pool;
// if (dbConfig.poolAlias) {
//   pool = oracledb.getPool(dbConfig.poolAlias);
// } else {
//   pool = await oracledb.createPool(
//     Object.assign(dbConfig, { poolMax: 10 }),
//   );
// }
// dbConfig.poolAlias = pool.poolAlias;
// this._executingCount = 0;

// return pool.getConnection();
