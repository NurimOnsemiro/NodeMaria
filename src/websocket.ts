import WebSocket from 'ws';

export function startWebSocket() {
    const ws = new WebSocket('ws://172.22.49.1:3001');

    console.log('[WEBSOCKET]');

    ws.on('open', () => {
        console.log('[WSOPEN]');
        ws.send(
            JSON.stringify({
                cmd: 100,
                masSerial: 999,
            }),
        );
    });

    ws.on('message', data => {
        console.log('[WSMESSAGE]');
        console.log(data);
    });
}
