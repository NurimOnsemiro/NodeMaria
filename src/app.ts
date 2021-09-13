import { executeQuery, initDb, startObjectInsertLoop, startObjectInsertCount, getBulkQuery } from './mariadb';
import { Worker, WorkerOptions } from 'worker_threads';
import * as ws from './websocket';
import path from 'path';
import { exit } from 'process';
import { mongoBase } from './mongodb';

async function main() {
    if (process.argv.length < 3) {
        console.log('./nodemaria.exe [websocket/mariadb/mongodb/mariadbcnt/mariadbcntthread/restapi]');
        process.exit(0);
    }

    let jobTypeSet = new Set<string>(['websocket', 'mariadb', 'mongodb', 'mariadbcnt', 'mariadbcntthread', 'restapi']);
    let jobType: string = process.argv[2];
    if (jobTypeSet.has(jobType) === false) {
        console.log('Job type is not valid; your input : ' + jobType);
        process.exit(0);
    }

    console.log('Job Type : ' + jobType);

    switch (jobType) {
        case 'websocket': {
            if (process.argv.length < 6) {
                console.log('./nodemaria.exe websocket [MAM IP] [MAS IP] [Insert Interval (ms)] [The number of records (default: infinity)]');
                process.exit(0);
            }

            let mamIp: string = process.argv[3];
            let masIp: string = process.argv[4];
            let insertIntervalMs: number = Number(process.argv[5]);
            //INFO: 삽입할 레코드 개수
            let numInsertRecords: number = Number(process.argv[6]);
            if (isNaN(insertIntervalMs)) {
                console.log('insertIntervalMs is not valid; your input : ' + process.argv[5]);
                process.exit(0);
            }

            ws.startWebSocket(mamIp, masIp, (masSerial: number) => {
                //ws.sendChannelState(masSerial);
                //ws.sendObjectDataLoop(masSerial, insertIntervalMs, numInsertRecords);
                //ws.sendEventDataLoop(masSerial, insertIntervalMs, numInsertRecords);
                ws.sendEventDetailDataLoop(masSerial, insertIntervalMs, numInsertRecords);
            });
            break;
        }
        case 'mariadb': {
            if (process.argv.length !== 6) {
                console.log('./nodemaria.exe mariadb [DB IP] [DB name] [Insert Interval (ms)]');
                process.exit(0);
            }

            let dbIp: string = process.argv[3];
            let dbName: string = process.argv[4];
            let insertIntervalMs: number = Number(process.argv[5]);
            if (isNaN(insertIntervalMs)) {
                console.log('insertIntervalMs is not valid; your input : ' + process.argv[5]);
                process.exit(0);
            }

            await initDb(dbIp, dbName);

            await startObjectInsertLoop(insertIntervalMs);

            break;
        }
        case 'mongodb': {
            if (process.argv.length !== 5) {
                console.log('./nodemaria.exe mongodb [DB IP] [The number of data]');
                process.exit(0);
            }

            let dbIp: string = process.argv[3];
            let numData: number = Number(process.argv[4]);
            if (isNaN(numData)) {
                console.log('numData is not valid; your input : ' + process.argv[4]);
                process.exit(0);
            }

            await mongoBase.init(dbIp);

            await mongoBase.startObjectInsertCount(numData);

            break;
        }
        case 'mariadbcnt': {
            if (process.argv.length !== 5) {
                console.log('./nodemaria.exe mariadbcnt [DB IP] [The number of data]');
                process.exit(0);
            }

            let dbIp: string = process.argv[3];
            let dbName: string = 'mamobject2';
            let numRecords: number = Number(process.argv[4]);

            await initDb(dbIp, dbName);

            await startObjectInsertCount(numRecords);

            process.exit(0);

            break;
        }
        case 'mariadbcntthread': {
            if (process.argv.length !== 6) {
                console.log('./nodemaria.exe mariadbcntthread [DB IP] [The number of data] [The number of threads]');
                process.exit(0);
            }

            let dbIp: string = process.argv[3];
            let dbName: string = 'mamobject2';
            let numRecords: number = Number(process.argv[4]);
            let numThreads: number = Number(process.argv[5]);
            numRecords = numRecords / numThreads;

            let bulkQuery = getBulkQuery();

            console.log('Start thread');
            let currCnt = 0;
            console.time('thread');
            for (let i = 0; i < numThreads; i++) {
                let worker = new Worker(path.join(process.cwd(), './src/worker.js'));
                worker.postMessage({
                    numRecords: numRecords,
                    dbIp: dbIp,
                    dbName: dbName,
                    bulkQuery: bulkQuery,
                });
                worker.on('message', value => {
                    currCnt++;
                    if (currCnt === numThreads) {
                        console.timeEnd('thread');
                        process.exit(0);
                    }
                });
            }

            break;
        }
        case 'restapi': {
            break;
        }
        default: {
            console.log('Job type is not valid; your input : ' + jobType);
            process.exit(0);
        }
    }
}
main();
