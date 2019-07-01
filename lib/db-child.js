const oracledb = require('oracledb')


class Connection {
    constructor() {
        this.dbConfig = {};
        this._executingCount = 0;
        this.connection = null;
        this.freeCheckTimeId = null;
        this.promiseCache = null;
    }

    get executingCount() {
        return this._executingCount;
    }
    async connect() {
        if (!this.promiseCache) {
            this.promiseCache = oracledb.getConnection(this.dbConfig)
        }
        return this.promiseCache;
    }

    async release() {
        if (this.connection) {
            const con = this.connection;
            this.connection = null;
            this.promiseCache = null;
            this._executingCount = 0;
            return con.release();
        }
    }

    async execute(
        sql,
        params = [],
        options = {
            autoCommit: true,
            outFormat: oracledb.OBJECT,
        },
    ) {
        this._executingCount++;
        if (!this.connection) {
            await this.connect()
                .then(con => {
                    this.connection = con;
                })
                .catch(err => {
                    this.finishOneSql();
                });
        } else {
            this.promiseCache = null;
        }
        const connection = this.connection;
        this.clearFreeCheckTimeout();
        return await connection
            .execute(sql, params, options)
            .then(res => {
                this.finishOneSql();
                return res;
            })
            .catch(err => {
                this.finishOneSql();
                this.release();
                return Promise.reject(err);
            });
    }

    finishOneSql() {
        this._executingCount = Math.max(0, this._executingCount - 1);
        this.doFreeCheck();
    }

    doFreeCheck() {
        if (this._executingCount === 0) {
            this.freeCheckTimeId = setTimeout(() => {
                this.freeCheckTimeId = null;
                this.release();
            }, 30 * 1000);
        } else {
            this.clearFreeCheckTimeout();
        }
    }

    clearFreeCheckTimeout() {
        if (this.freeCheckTimeId) {
            clearTimeout(this.freeCheckTimeId);
            this.freeCheckTimeId = null;
        }
    }
}
const a = new Connection()
// a.execute(`select Sysdate from dual`).then((res) => console.log(res.rows))
process.on('message', function ({
    id,
    type,
    params
}) {
    switch (type) {
        case 1:
            a.dbConfig = params;
            process.send({
                id
            });
            break;
        case 2:
            a.execute(...params).then((res) => {
                process.send({
                    id,
                    res
                });
            }).catch((err) => {
                process.send({
                    id,
                    err
                });
            })
            break;
    }
});