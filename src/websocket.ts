import WebSocket from 'ws';

import { default as objSample } from '../assets/object_sample.json';

let ws: WebSocket;
let isOpen: boolean = false;
// let serverIp: string = '172.22.49.1';
// let masIp: string = '255.255.255.255';
//let insertIntervalMs: number = 2000;

export function startWebSocket(mamIp: string, masIp: string, callback: Function) {
    ws = new WebSocket(`ws://${mamIp}:3001`);

    console.log('[WEBSOCKET]');

    ws.on('open', () => {
        isOpen = true;
        console.log('[WSOPEN]');
        ws.send(
            JSON.stringify({
                cmd: 100,
                masIP: masIp,
                masPort: '8002',
                masVersion: '1.6.0.999999',
                masPath: 'C:\\MAS',
                masStatus: 1,
                masIPEx: '',
                masPortEx: 0,
            }),
        );
    });

    ws.on('message', data => {
        let objData = JSON.parse(data.toString('utf8'));
        if (objData.cmd === 301) {
            return;
        }
        console.log('[WSMESSAGE]');
        if (objData.cmd === 101) {
            callback(objData.res.masSerial);
            return;
        }
    });

    ws.on('close', (code: number, reason: string) => {
        isOpen = false;
        console.log('[WSCLOSE]');
        console.log(`code : ${code}, reason : ${reason}`);
    });
}

async function sleepMs(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

function filetimeFromDate() {
    return Date.now() * 1e4 + 116444736e9;
}

export async function sendObjectDataLoop(masSerial: number, insertIntervalMs: number) {
    console.log('[SENDOBJ] Ready');
    await sleepMs(3000);
    console.log('[SENDOBJ] Start');

    objSample.mas_serial = masSerial;

    while (isOpen) {
        console.log('[SENDOBJ] Sending');
        objSample.object.start_time = filetimeFromDate();
        objSample.object.end_time = objSample.object.start_time;
        ws.send(JSON.stringify(objSample));
        await sleepMs(insertIntervalMs);
    }
}
