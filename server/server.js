const http = require('http');
const express = require('express');

const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath));
console.log(`Serving from ${clientPath}`);

io.on('connection', (sock) => {
    sock.emit('message', 'You are connected to the game!');
    console.log("Someone has been connected!");
});

server.on('error', (err) => {
    console.error("Server error: ", err);
});

server.listen(3004, () => {
    console.log("RPS server is up and running!");
});


// Juliaus stuff follows:
console.log("as esu robotas.");