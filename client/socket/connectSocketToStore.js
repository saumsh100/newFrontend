import {
  addSocketEntity,
} from '../actions/entities';
import jwt from 'jwt-decode';

const jwtToken = localStorage.getItem('token');
const decodedToken = jwt(jwtToken);
console.log(`[INFO] account=${decodedToken.activeAccountId}`);
console.log('[INFO] jwt token: ', jwtToken);

export default function connectSocketToStore(socket, store) {
  socket.on('connect', () => {
    socket
      .emit('authenticate', { token: jwtToken })
      .on('authenticated', () => {
        console.log('Socket connected and authenticated');
      })
      .on('unauthorized', (msg) => {
        console.log('unauthorized: ', JSON.stringify(msg.data));
        throw new Error(msg.data.type);
      });
  });

  socket.on('addRequest', (data) => {
    store.dispatch(addSocketEntity({ key: 'requests', entity: data }));
  });

  socket.on('newJoin', () => {
    console.log('>>>> new join');
  });
}
