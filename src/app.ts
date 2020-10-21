import { executeQuery, initDb, startObjectInsertLoop } from './mariadb';
import * as ws from './websocket';

async function main() {
    if (process.argv.length < 3) {
        console.log('./nodemaria.exe [websocket/mariadb/restapi]');
        process.exit(0);
    }

    let jobTypeSet = new Set<string>(['websocket', 'mariadb', 'restapi']);
    let jobType: string = process.argv[2];
    if (jobTypeSet.has(jobType) === false) {
        console.log('Job type is not valid; your input : ' + jobType);
        process.exit(0);
    }

    console.log('Job Type : ' + jobType);

    switch (jobType) {
        case 'websocket': {
            if (process.argv.length !== 6) {
                console.log('./nodemaria.exe websocket [MAM IP] [MAS IP] [Insert Interval (ms)]');
                process.exit(0);
            }

            let mamIp: string = process.argv[3];
            let masIp: string = process.argv[4];
            let insertIntervalMs: number = Number(process.argv[5]);
            if (isNaN(insertIntervalMs)) {
                console.log('insertIntervalMs is not valid; your input : ' + process.argv[5]);
                process.exit(0);
            }

            ws.startWebSocket(mamIp, masIp, (masSerial: number) => {
                //ws.sendObjectDataLoop(masSerial, insertIntervalMs);
                ws.sendEventDataLoop(masSerial, insertIntervalMs);
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
