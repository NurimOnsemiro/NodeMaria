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
