import WebSocket from 'ws';
import moment from 'moment';

import { default as objSample } from '../assets/object_sample.json';
import { default as evtSample } from '../assets/event_sample.json';
import { default as evtDetailSample } from '../assets/event_detail_sample.json';
import { sleepMs, filetimeFromDate } from './utils';

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
                masSerial: 5,
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
        if (objData.cmd === 301 || objData.cmd === 305) {
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

function getRandomValue() {
    return Math.floor(Math.random() * 100);
}

export async function sendEventDataLoop(masSerial: number, insertIntervalMs: number) {
    console.log('[SENDEVT] Ready');
    await sleepMs(3000);
    console.log('[SENDEVT] Start');

    evtSample.mas_serial = masSerial;

    while (isOpen) {
        console.log('[SENDEVT] Sending');
        evtSample.event.date = moment().format('YYYY-MM-DD');
        evtSample.event.hour = Number(moment().format('HH'));
        evtSample.event.evt_start = 10000000;
        evtSample.event.evt_end = evtSample.event.evt_start;
        evtSample.event.roi_appear = getRandomValue();
        evtSample.event.roi_loitering = getRandomValue();
        evtSample.event.roi_crowd_small = getRandomValue();
        evtSample.event.roi_crowd_large = getRandomValue();
        evtSample.event.roi_line_crossing_in = getRandomValue();
        evtSample.event.roi_line_crossing_out = getRandomValue();
        evtSample.event.roi_people_counting = getRandomValue();
        ws.send(JSON.stringify(evtSample));
        await sleepMs(insertIntervalMs);
    }
}

let eventTypeSet = [1, 2, 4, 8, 16, 32, 64];

export async function sendEventDetailDataLoop(masSerial: number, insertIntervalMs: number) {
    console.log('[SENDEVTDT] Ready');
    await sleepMs(3000);
    console.log('[SENDEVTDT] Start');

    evtDetailSample.mas_serial = masSerial;

    while (isOpen) {
        console.log('[SENDEVTDT] Sending');
        evtDetailSample.event_detail.evt_start = filetimeFromDate();
        evtDetailSample.event_detail.evt_end = evtDetailSample.event_detail.evt_start;
        evtDetailSample.event_detail.ref_event_id = eventTypeSet[getRandomValue() % 7];
        evtDetailSample.event_detail.roi_preset = getRandomValue();
        evtDetailSample.event_detail.roi_event_zone = getRandomValue();
        evtDetailSample.event_detail.object_id = getRandomValue();
        evtDetailSample.event_detail.param_1 = getRandomValue();
        evtDetailSample.event_detail.param_2 = getRandomValue();
        ws.send(JSON.stringify(evtDetailSample));
        await sleepMs(insertIntervalMs);
    }
}
