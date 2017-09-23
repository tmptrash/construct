const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8090');

ws.on('open', function () {
  ws.send('something');
    setInterval(() => {
        ws.send(Date.now());
    }, 1000);
});

ws.on('message', function (data) {
  console.log(data);
});

ws.on('error', function (err) {
    console.log('Error: ' + err);
});