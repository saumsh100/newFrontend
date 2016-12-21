
export default function connectSocketToStore(socket, store) {
  socket.on('connect', (args) => {
    console.log('CONNECTED');
  });
}

