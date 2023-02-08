const socket = io('http://localhost:9000'); // the / endpoint
const socket2 = io('http://localhost:9000/admin'); //the /admin namespace or endpoint. In socket language this is namespace

socket.on('connect', () => {
  console.log('First Socket', socket.id);
});

socket2.on('connect', () => {
  console.log('Second Socket', socket.id);
});

socket.on('joined', (msg) => {
  console.log(msg);
});

socket.on('welcome', (dataFromServer) => {
  console.log(dataFromServer);
});

socket2.on('welcome', (dataFromServer) => {
  console.log(dataFromServer);
});

socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);
  // socket.emit('messageToServer', { data: 'This is from the client' });
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  socket.emit('newMessageToServer', { text: newMessage });
});
