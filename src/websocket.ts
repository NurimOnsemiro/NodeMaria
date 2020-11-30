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

const labelList: string[] = [
    'PERSON',
    'MAN',
    'OLD_MAN',
    'WOMAN',
    'OLD_WOMAN',
    'BOY',
    'GIRL',
    'VEHICLE',
    'CAR',
    'BUS',
    'TAXI',
    'TRUCK',
    'VAN',
    'BICYCLE',
    'MOTORBIKE',
    'WHEELCHAIR',
];

const eventList: number[] = [1, 2, 4, 8, 16, 32, 64];

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
        console.log('[WS.MESSAGE]');
        if (objData.cmd === 101) {
            callback(objData.res.masSerial);
            return;
        }
    });

    ws.on('close', (code: number, reason: string) => {
        isOpen = false;
        console.log('[WS.CLOSE]');
        console.log(`code : ${code}, reason : ${reason}`);
    });
}

export async function sendObjectDataLoop(masSerial: number, insertIntervalMs: number, numInsertRecords: number = null) {
    console.log('[OBJ] Ready');
    await sleepMs(3000);
    console.log('[OBJ] Start');

    objSample.mas_serial = masSerial;

    if (numInsertRecords == null) {
        numInsertRecords = -1;
    }

    let cnt: number = 0;

    while (isOpen && cnt !== numInsertRecords) {
        if (cnt % 10 === 0) {
            console.log(`[OBJ] Sending - ${cnt}/${numInsertRecords}`);
        }

        objSample.object.start_time = filetimeFromDate();
        objSample.object.end_time = objSample.object.start_time;
        objSample.object.classify.label = labelList[getRandomValue() % labelList.length];
        objSample.object.ref_event_id = eventList[getRandomValue() % eventList.length];
        objSample.object.score = Math.random();
        ws.send(JSON.stringify(objSample));
        await sleepMs(insertIntervalMs);
        cnt++;
    }

    console.log('[OBJ] Send Finish');
    process.exit(0);
}

function getRandomValue() {
    return Math.round(Math.random() * 100);
}

export async function sendEventDataLoop(masSerial: number, insertIntervalMs: number, numInsertRecords: number = null) {
    console.log('[EVT] Ready');
    await sleepMs(3000);
    console.log('[EVT] Start');

    evtSample.mas_serial = masSerial;

    if (numInsertRecords == null) {
        numInsertRecords = -1;
    }

    let cnt: number = 0;
    //INFO: 20년 전
    let startDate: number = Date.now() - 1000 * 60 * 60 * 24 * 365 * 18;
    //INFO: 1시간 단위
    let hourUnit: number = 1000 * 60 * 60;

    let incDate = startDate;

    while (isOpen && cnt !== numInsertRecords) {
        if (cnt % 100 === 0) {
            console.log(`[EVT] Sending - ${cnt}/${numInsertRecords}`);
        }

        let momentData = moment(incDate);
        evtSample.event.date = momentData.format('YYYY-MM-DD');
        evtSample.event.hour = Number(momentData.format('HH'));
        evtSample.event.evt_obj_count = getRandomValue();
        evtSample.event.roi_appear = getRandomValue();
        evtSample.event.roi_loitering = getRandomValue();
        evtSample.event.roi_stationary_status = getRandomValue();
        evtSample.event.roi_crowd_small = getRandomValue();
        evtSample.event.roi_crowd_large = getRandomValue();
        evtSample.event.roi_line_crossing_in = getRandomValue();
        evtSample.event.roi_line_crossing_out = getRandomValue();
        evtSample.event.roi_people_counting = getRandomValue();
        ws.send(JSON.stringify(evtSample));
        await sleepMs(insertIntervalMs);
        cnt++;
        incDate += hourUnit;
    }

    console.log('[EVT] Send Finish');
    process.exit(0);
}

let eventTypeSet = [1, 2, 4, 8, 16, 32, 64];

export async function sendEventDetailDataLoop(masSerial: number, insertIntervalMs: number, numInsertRecords: number = null) {
    console.log('[EVT.DT] Ready');
    await sleepMs(3000);
    console.log('[EVT.DT] Start');

    evtDetailSample.mas_serial = masSerial;

    if (numInsertRecords == null) {
        numInsertRecords = -1;
    }
    let cnt: number = 0;

    while (isOpen && cnt !== numInsertRecords) {
        if (cnt % 100 === 0) {
            console.log(`[EVT.DT] Sending - ${cnt}/${numInsertRecords}`);
        }
        evtDetailSample.event_detail.startTime = filetimeFromDate();
        evtDetailSample.event_detail.endTime = evtDetailSample.event_detail.startTime;
        evtDetailSample.event_detail.ref_event_id = eventTypeSet[getRandomValue() % 7];
        evtDetailSample.event_detail.presetNo = getRandomValue();
        evtDetailSample.event_detail.zoneID = getRandomValue();
        evtDetailSample.event_detail.objectID = getRandomValue();
        evtDetailSample.event_detail.param_1 = getRandomValue();
        evtDetailSample.event_detail.param_2 = getRandomValue();
        ws.send(JSON.stringify(evtDetailSample));
        await sleepMs(insertIntervalMs);
        cnt++;
    }

    console.log('[EVT.DT] Send Finish');
    process.exit(0);
}
