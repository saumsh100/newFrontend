
export default function connectSocketToEmbedStore(socket, store) {
  socket.on('connect', (args) => {
    console.log('CONNECTED to CareCru from EMBED');
    console.log(args);
  });
}

