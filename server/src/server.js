const WebSocket = require('ws');


function onMessage(event) {
    console.log('received: %s', event.data);
}

function onError(err) {
    console.log('Error: ' + err);
}

function onClose(s) {
    console.log('Connection closed: ' + JSON.stringify(s));
}

function onConnect(sock) {
    console.log('Client connected');
    sock.on('message', onMessage);
    sock.on('error', onError);
    sock.on('close', onClose);
}

function main() {
    const server = new WebSocket.Server({port: 8090});
    server.on('connection', onConnect);
    console.log('Server is ready');
}

main();