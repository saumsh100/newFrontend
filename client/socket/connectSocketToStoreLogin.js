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
    .on('create:Request', (data) => {
      store.dispatch(addEntity({ key: 'requests', entity: data }));
    })
    .on('update:Request', (data) => {
      store.dispatch(updateEntity({ key: 'requests', entity: data }));
    })
    .on('remove:Request', (data) => {
      store.dispatch(deleteEntity({ key: 'requests', id: data }));
    })

    /**
     * Appointment Socket
     */
    .on('create:Appointment', (data) => {
      store.dispatch(addEntity({ key: 'appointments', entity: data }));
    })
    .on('update:Appointment', (data) => {
      store.dispatch(updateEntity({ key: 'appointments', entity: data }));
    })
    .on('remove:Appointment', (data) => {
      store.dispatch(deleteEntity({ key: 'appointments', id: data }));
    })

    /**
     * Patient Socket
     */
    .on('create:Patient', (data) => {
      store.dispatch(addEntity({ key: 'appointments', entity: data }));
    })
    .on('update:Patient', (data) => {
      store.dispatch(updateEntity({ key: 'appointments', entity: data }));
    })
    .on('remove:Patient', (data) => {
      store.dispatch(deleteEntity({ key: 'appointments', id: data }));
    })


    .on('syncClientError', (data) => {
      console.log('[ TEMP ] normalized logEntry', data);
    });
}

