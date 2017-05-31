import jwt from 'jwt-decode';
import {
  addSocketEntity,
} from '../actions/entities';

export default function connectSocketToStoreLogin(socket, store) {
  const jwtToken = localStorage.getItem('token');
  const decodedToken = jwt(jwtToken);
  console.log(`[INFO] account=${decodedToken.activeAccountId}`);
  console.log('[INFO] jwt token: ', jwtToken);

  socket
    .emit('authenticate', {token: jwtToken})
    .on('authenticated', () => {
      console.log('client/socket/connectSocketToStoreLogin.js: Socket connected and authenticated');
    })
    .on('unauthorized', (msg) => {
      console.log('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    })
    .on('addRequest', (data) => {
      store.dispatch(addSocketEntity({ key: 'requests', entity: data }));
    })
    .on('create:Appointment', (data) => {
      console.log('EVENT:addAppointment: data=', data);
    })
    .on('update:Appointment', (data) => {
      console.log('EVENT:update:Appointment: data=', data);
    })
    .on('syncClientError', (data) => {
      console.log('[ TEMP ] normalized logEntry', data);
    });
}

