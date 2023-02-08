const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
console.log(namespaces);

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000, () => {
  console.log('Listening on port 9000');
});
const io = socketio(expressServer);

io.on('connection', (socket) => {
  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient);
  });
  socket.join('level1');
  io.of('/')
    .to('level1')
    .emit('joined', `${socket.id} says I have joined the level 1 room`);
});

io.of('/admin').on('connection', (socket) => {
  console.log('Someone connected to the admin namespace');
  io.of('/admin').emit('welcome', 'Welcome to the admin namespace');
});
