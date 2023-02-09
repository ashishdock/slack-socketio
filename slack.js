const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
// console.log(namespaces[0]);

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000, () => {
  console.log('Listening on port 9000');
});
const io = socketio(expressServer);

let username = '';

io.on('connection', (socket) => {
  // console.log(socket.handshake);
  // build an array to send back with the img and endpoint for each namespace
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  // console.log(nsData);
  // send the nsdata back to the client. We need to use socket, NOT io, because we want it to go to just this client.
  socket.emit('nsList', nsData);
});

//! loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  // console.log(namespace);
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    const username = nsSocket.handshake.query.username;
    console.log(nsSocket.handshake);
    console.log('Username: ', username);
    // console.log(`${nsSocket.id} has joined namespace ${namespace.endpoint}`);
    // a socket has connected to one of our chatgroup namespaces. send that namespace group info back
    nsSocket.emit('nsRoomLoad', namespace.rooms);
    nsSocket.on('joinRoom', async (roomToJoin, numberOfUsersCallback) => {
      // deal with history ... once we have it
      // console.log('Room to join');
      const roomsList = Array.from(nsSocket.rooms);
      // console.log('nsSocket.rooms before leave and join', nsSocket.rooms);
      const roomToLeave = roomsList[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      // console.log('nsSocket.rooms after join', nsSocket.rooms);

      // console.log(`${nsSocket.id} has joined room ${roomToJoin}`);

      // const clients = await io.of(namespace.endpoint).in(roomToJoin).fetchSockets();
      // numberOfUsersCallback(clients.length);

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });
      // console.log('nsRoom', nsRoom);
      // console.log('nsRoom.history', nsRoom.history);
      nsSocket.emit('historyCatchUp', nsRoom.history);
      // Send back the number of users in this room to ALL sockets connected to this room

      updateUsersInRoom(namespace, roomToJoin);
      //TODO: UPDATE USERS IN ROOM
      // const count = io.of(namespace.endpoint).clients.size;
      // console.log(Array.from(clients));
      // for (const client of clients) {
      //   console.log(client.id);
      // }
      // console.log('Clients Length: ', clients.length);

      // io.of(namespace.endpoint)
      //   .in(roomToJoin)
      //   .fetchSockets()
      //   .then((clients) => {
      //     numberOfUsersCallback(Array.from(clients).length);
      //     console.log('Clients Size: ', clients);
      //     console.log('Total users: ', Array.from(clients).length);
      //   });
      // const roomTitle = Array.from(nsSocket.rooms)[1];
    });

    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        userName: username,
        avatar: 'https://via.placeholder.com/30',
      };
      // console.log(fullMsg);
      // send this message to all sockets that are in the room that this socket is in
      // how to find out which room this socket is in?
      // console.log('**********nsSockets is in these rooms', nsSocket.rooms);
      // the user will be in the second room because the socket always first joins it's own room on connection
      // get the keys
      const roomTitle = Array.from(nsSocket.rooms)[1];
      // console.log(roomTitle[1]);

      // we need to find the Room object for this room
      // console.log('++++++++ All namespaces: ', namespaces);
      // console.log('namespaces[0]', namespaces[0].rooms);
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });
      // console.log('****The room object that we made matches this NS room ...');
      // console.log(nsRoom);
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});

async function updateUsersInRoom(namespace, roomToJoin) {
  const clients = await io.of(namespace.endpoint).in(roomToJoin).fetchSockets();

  io.of(namespace.endpoint)
    .in(roomToJoin)
    .emit('updateMembers', clients.length);
}
