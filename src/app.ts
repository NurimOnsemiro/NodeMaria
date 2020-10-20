import { createPool, PoolConnection } from 'mariadb';
import fs from 'fs';
import path from 'path';

const dbName: string = 'test';

const pool = createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'pass',
    connectionLimit: 5,
    database: dbName,
    multipleStatements: true,
});

async function executeQuery(query: string, param: any[] = null) {
    let conn: PoolConnection;
    let queryResult: object[];
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

async function main() {
    let query: string = fs.readFileSync(path.join(process.cwd(), './assets/dbinit.sql')).toString('utf8');
    console.log('[DBINIT]');
    console.log(query);
    await executeQuery(query);

    let queryResult: object[];
    queryResult = await executeQuery('SELECT * FROM user_account');
    for (let userInfo of queryResult) {
        console.log(userInfo);
    }
    await pool.end();
    console.log('Program End');
}
main();
