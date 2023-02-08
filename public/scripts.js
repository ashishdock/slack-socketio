const socket = io('http://localhost:9000'); // the / endpoint

socket.on('connect', () => {
  console.log('First Socket', socket.id);
});

// Listen for nsList, which is a list of all the namespaces
socket.on('nsList', (nsData) => {
  console.log('The list of namespaces has arrived');
  // console.log(nsData);
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}> <img src="${ns.img}" /></div>`;
  });

  // Add a click listener for each NS
  Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
    elem.addEventListener('click', (e) => {
      const nsEndpoint = elem.getAttribute('ns');
      console.log(`${nsEndpoint} I should go to now`);
    });
  });

  const nsSocket = io('http://localhost:9000/wiki');
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';
    nsRooms.forEach((room) => {
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${
        room.privateRoom ? 'lock' : 'globe'
      }"></span>${room.roomTitle}</li>`;
    });

    // add click listener to each room
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener('click', (e) => {
        console.log('Someone clicked on ', e.target.innerText);
      });
    });
  });
});

socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);
  // socket.emit('messageToServer', { data: 'This is from the client' });
});

// document.querySelector('#message-form').addEventListener('submit', (event) => {
//   event.preventDefault();
//   const newMessage = document.querySelector('#user-message').value;
//   socket.emit('newMessageToServer', { text: newMessage });
// });
