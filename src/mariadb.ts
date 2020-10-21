import fs from 'fs';
import path from 'path';

import { createPool, PoolConnection } from 'mariadb';

const dbName: string = 'test';

const pool = createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'pass',
    connectionLimit: 5,
    database: dbName,
    multipleStatements: true,
});

export async function initDb() {
    console.log('[INITDB] BEGIN');
    let query: string = fs.readFileSync(path.join(process.cwd(), './assets/dbinit.sql')).toString('utf8');
    await executeQuery(query);
    console.log('[INITDB] END');
}

export async function executeQuery(query: string, param: any[] = null) {
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
