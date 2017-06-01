import jwt from 'jwt-decode';
import {
  addSocketEntity,
  addEntity,
  updateEntity,
  deleteEntity,
} from '../actions/entities';


export default function connectSocketToStoreLogin(store, socket) {
  const jwtToken = localStorage.getItem('token');

  socket
    .emit('authenticate', { token: jwtToken })
    .on('authenticated', () => {
      console.log('client/socket/connectSocketToStoreLogin.js: Socket connected and authenticated');
    })
    .on('unauthorized', (msg) => {
      console.log('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    })

    /**
     * Request Socket
     */
    .on('new:Request', (data) => {
      store.dispatch(addEntity({ key: 'requests', entity: data }));
    })
    .on('confirm:Request', (data) => {
      store.dispatch(updateEntity({ key: 'requests', entity: data }));
    })
    .on('delete:Request', (data) => {
      console.log('deleted request');
      store.dispatch(deleteEntity({ key: 'requests', id: data }));
    })


    /**
     * Appointment Socket
     */
    .on('create:Appointment', (data) => {
      console.log('Event:create:Appointment');
      store.dispatch(addEntity({ key: 'appointments', entity: data }));
    })
    .on('update:Appointment', (data) => {
      console.log('EVENT:update:Appointment: data=', data);
      store.dispatch(updateEntity({ key: 'appointments', entity: data }));
    })
    .on('syncClientError', (data) => {
      console.log('[ TEMP ] normalized logEntry', data);
    });
}

