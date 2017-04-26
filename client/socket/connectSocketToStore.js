import jwt from 'jwt-decode';
import {
  addSocketEntity,
} from '../actions/entities';

export default function connectSocketToStore(socket, store) {
  const jwtToken = localStorage.getItem('token');
  const decodedToken = jwt(jwtToken);
  console.log(`[INFO] account=${decodedToken.activeAccountId}`);
  console.log('[INFO] jwt token: ', jwtToken);

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
    console.log('request received');
    store.dispatch(addSocketEntity({ key: 'requests', entity: data }));
  });

  socket.on('add:Appointment', (data) => {
    console.log('EVENT:addAppointment: data=', data);
  });

  socket.on('update:Appointment', (data) => {
    console.log('EVENT:update:Appointment: data=', data);
  });

  socket.on('syncClientError', (data) => {
    console.log('[ TEMP ] normalized logEntry', data);
  });
}

