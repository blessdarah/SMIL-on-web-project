const ws = new WebSocket('ws://localhost:3002');

ws.onerror = function(err) {
    console.error('failed to make websocket connection');
    throw err;
};

ws.onopen = function() {
    console.log('connection established');
};

ws.onmessage = (event) => {
    console.log('event: ', event);
    // li.textContent = event.data;
};