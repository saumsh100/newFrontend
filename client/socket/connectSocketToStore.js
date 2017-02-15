import {
  addEntity,
} from '../actions/entities';

export default function connectSocketToStore(socket, store) {
  socket.on('connect', (args) => {
    console.log('CONNECTED');
  });

  socket.on('receiveRequest', (data) => {


    //const modelData = {requests: data};
    store.dispatch(addEntity({key: 'requests', entity: map} ));
  });
}

