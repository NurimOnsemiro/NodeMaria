const { threadId, parentPort, workerData } = require('worker_threads');
const { createPool } = require('mariadb');

let pool;

parentPort.on('message', async data => {
    let numRecords = data.numRecords;
    let bulkQuery = data.bulkQuery;
    let dbIp = data.dbIp;
    let dbName = data.dbName;

    //console.log('create pool ' + threadId);

    pool = createPool({
        host: dbIp,
        user: 'root',
        password: 'pass',
        connectionLimit: 5,
        database: dbName,
        multipleStatements: true,
    });

    await startObjectInsertCount(bulkQuery, numRecords);

    parentPort.postMessage('done');
    parentPort.close();
});

async function executeQuery(query, param = null) {
    if (pool == null) {
        console.log('DB pool is null');
        return;
    }
    let conn;
    let queryResult;
    try {
        conn = await pool.getConnection();
        queryResult = await conn.query(query, param);
    } catch (ex) {
        throw {
            message: ex.message,
        };
    } finally {
        if (conn) conn.release();
    }
    return queryResult;
}

/**
 * 특정 개수만큼 레코드 삽입
 * @param numRecords 삽입할 행 개수
 */
async function startObjectInsertCount(bulkQuery, numRecords) {
    //console.log('[INSERTOBJCNT] Ready ' + threadId);
    //console.log('[INSERTOBJCNT] Start ' + threadId);

    let cnt = Math.round(numRecords / 10);
    //console.time('mariadbcnt' + threadId);
    for (let i = 0; i < cnt; i++) {
        await executeQuery(bulkQuery);
    }
    //console.timeEnd('mariadbcnt' + threadId);
    //console.log('[INSERTOBJCNT] Finish ' + threadId);
}
