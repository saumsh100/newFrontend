import {
  addSocketEntity,
} from '../actions/entities';


export default function connectSocketToStore(socket, store) {
  socket.on('connect', (args) => {
    console.log('CONNECTED');
  });

  socket.on('addRequest', (data) => {
    store.dispatch(addSocketEntity({ key: 'requests', entity: data }));
  });
}

