import fs from 'fs';
import path from 'path';
import moment from 'moment';

import { default as objSample } from '../assets/object_sample.json';
import { createPool, Pool, PoolConnection } from 'mariadb';
import { sleepMs, filetimeFromDate } from './utils';

let pool: Pool;

export async function initDb(dbIp: string, dbName: string) {
    console.log('[INITDB] BEGIN');
    pool = createPool({
        host: dbIp,
        user: 'root',
        password: 'pass',
        connectionLimit: 5,
        database: dbName,
        multipleStatements: true,
    });
    //let query: string = fs.readFileSync(path.join(process.cwd(), './assets/dbinit.sql')).toString('utf8');
    //await executeQuery(query);
    console.log('[INITDB] END');
}

export async function executeQuery(query: string, param: any[] = null) {
    if (pool == null) {
        console.log('DB pool is null');
        return;
    }
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

let objectSample = {
    mas_serial: 0,
    object_id: 0,
    start_time: '',
    end_time: '',
    ref_device_id: 0,
    ref_label_id: 0,
    ref_event_id: 0,
    ref_attr_color1: 0,
    ref_attr_color2: 0,
    ref_attr_color3: 0,
    attr_score: 0,
    attr_bag_pack: 0,
    attr_bag_etc: 0,
    attr_umbrella: 0,
    thumbnail_time: 0,
    thumbnail: '',
};

const objectKeyList: string[] = Object.keys(objectSample);

let dataSample = {
    mas_serial: objSample.mas_serial,
    object_id: objSample.object.objectId,
    start_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    end_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    ref_device_id: 57,
    ref_label_id: 100000,
    ref_event_id: 64,
    ref_attr_color1: 3056,
    ref_attr_color2: 3056,
    ref_attr_color3: 3056,
    attr_score: 0.99965,
    attr_bag_pack: 0,
    attr_bag_etc: 0,
    attr_umbrella: 0,
    thumbnail_time: 132191358900253170,
    thumbnail:
        '{"thumbnail":"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","thumbnailRect":{"x":0.5838541666666667,"y":0.5388888888888889,"w":0.2822916666666666,"h":0.425}}',
};

function createInsertQuery(): string {
    let preQuery;

    preQuery = `INSERT INTO tb_object_${moment().format('YYYYMM')} (`;

    for (let i = 0; i < objectKeyList.length; i++) {
        if (i !== 0) preQuery += ', ';
        preQuery += objectKeyList[i];
    }

    preQuery += ') VALUES ';
    let query: string = '';
    query = preQuery;
    for (let i = 0; i < 10; i++) {
        if (i !== 0) {
            query += ', ';
        }
        let data = dataSample;
        let tempQuery: string = '(';
        for (let j = 0; j < objectKeyList.length; j++) {
            if (j !== 0) tempQuery += ', ';
            let objectKey: string = objectKeyList[j];
            if (typeof data[objectKey] === 'string') {
                tempQuery += `'${data[objectKey]}'`;
            } else {
                tempQuery += `${data[objectKey]}`;
            }
        }
        tempQuery += ')';
        query += tempQuery;
    }
    return query;
}

export async function startObjectInsertLoop(insertIntervalMs: number) {
    console.log('[INSERTOBJ] Ready');
    objSample.mas_serial = 0;
    let bulkQuery: string = createInsertQuery();
    console.log(bulkQuery);
    await sleepMs(3000);
    console.log('[INSERTOBJ] Start');

    while (true) {
        console.log('[INSERTOBJ] Inserting');
        await executeQuery(bulkQuery);
        await sleepMs(insertIntervalMs);
    }
}
