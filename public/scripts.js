const user = prompt('What is your username?');
console.log(user);

// const socket = io('http://localhost:9000'); // the / endpoint
const socket = io('http://localhost:9000', {
  query: {
    username: user.toString(),
  },
});
let nsSocket;

// Listen for nsList, which is a list of all the namespaces
socket.on('nsList', (nsData) => {
  // console.log('The list of namespaces has arrived');
  // console.log(nsData);
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}> <img src="${ns.img}" /></div>`;
  });

  // Add a click listener for each NS
  // console.log(document.getElementsByClassName('namespace'));
  Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
    elem.addEventListener('click', (e) => {
      const nsEndpoint = elem.getAttribute('ns');
      console.log(`${nsEndpoint} I should go to now`);
      joinNs(nsEndpoint.replace('/', ''));
    });
  });

  joinNs('wiki');
});
