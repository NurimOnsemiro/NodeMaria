import { nextTick } from 'process';
import WebSocket from 'ws';

export async function sleepMs(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
        if (ms === 0) {
            resolve();
        }
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function filetimeFromDate() {
    return Date.now() * 1e4 + 116444736e9;
}

export function asyncWsSend(ws: WebSocket, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
        ws.send(data, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export function sleepTick(): Promise<void> {
    return new Promise(resolve => {
        setImmediate(() => {
            resolve();
        });
    });
}
