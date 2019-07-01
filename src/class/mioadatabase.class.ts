import * as oracledb from 'oracledb';
import { dbConfig } from '../config/config';

export class Database {
    dbConfig: IDbConnection;
    constructor(
    ) {
        if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
            this.dbConfig = dbConfig.mioaProductionDB;
        } else {
            this.dbConfig = dbConfig.mioaDevDB;
        }
    }

    async getConnection() {
        return await oracledb.getConnection({
            user: this.dbConfig.user,
            password: this.dbConfig.password,
            connectString: this.dbConfig.connectString,
        });
    }

    async release(conn) {
        try {
            await conn.release();
        } catch (e) {
            // tslint:disable-next-line:no-console
            // console.error(e);
        }
    }

    async execute(
        sql: string,
        params: any = [],
        options: oracledb.IExecuteOptions = {
            autoCommit: true,
            outFormat: oracledb.OBJECT,
        },
    ) {
        let conn;
        try {
            conn = await this.getConnection();
            return await conn.execute(sql, params, options);
        } catch (err) {
            // tslint:disable-next-line:no-console
            // console.log(err);

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
}

interface IDbConnection {
    user: string;
    password: string;
    connectString: string;
}
