function joinRoom(roomName) {
  // console.log('Join Room activated');
  // console.log('Sending request to join room: ', roomName);
  // send this roomName to the server
  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    //we want to update the room member total now that we have joined
    console.log(`${nsSocket.id} has joined ${roomName}.`);
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user">`;
  });

  nsSocket.on('historyCatchUp', (history) => {
    console.log('History', history);

    const messagesUl = document.querySelector('#messages');
    messagesUl.innerHTML = '';
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  });

  nsSocket.on('updateMembers', (numMembers) => {
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user">`;

    document.querySelector('.curr-room-text').innerText = `${roomName} `;
  });
}
