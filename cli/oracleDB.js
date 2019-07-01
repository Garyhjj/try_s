const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
const config = {
    productionDB: {
        user: 'mil',
        password: 'milacgs',
        connectString: `10.86.0.146:1521/milgs`,
    },
    devDB: {
        user: 'mil',
        password: 'milacgs',
        connectString: `10.86.0.107:1521/milgs`,
    },
};
let dbConfig;
if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
    console.log(1111)
    dbConfig = config.productionDB;
} else {
    dbConfig = config.devDB;
}


async function getConnection() {
    return await oracledb.getConnection({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
    });
}

async function release(conn) {
    try {
        await conn.release();
    } catch (e) {
        console.error(e);
    }
}

function execute(sql, isBlock) {
    let conn, succRes, errMes;
    return oracledb.getConnection({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
    }).then((c) => {
        conn = c;
        return conn.execute(isBlock ? sql : sql, [], {
            autoCommit: true,
            extendedMetaData: true
        })
    }).then((res) => {
        succRes = res;
        return conn.release();
    }, ).catch(err => {
        errMes = err;
        return conn.release();
    }).then((_) => {
        if (errMes) {
            const errM = typeof errMes === 'string' ? errMes : errMes.stack;
            throw new Error(errM);
        } else {
            return succRes;
        }
    });
}



module.exports = {
    getConnection,
    release,
    execute,
    search: async (sql) => {
        const r = await execute(sql);
        return r.rows;
    }
}