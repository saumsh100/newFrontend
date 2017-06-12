import jwt from 'jwt-decode';
import {
  addSocketEntity,
  addEntity,
  updateEntity,
  deleteEntity,
  receiveEntities,
} from '../actions/entities';


export default function connectSocketToStoreLogin(store, socket) {
  const jwtToken = localStorage.getItem('token');
  const { dispatch, getState } = store;

  socket
    .emit('authenticate', { token: jwtToken })
    .on('authenticated', (socket) => {
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
      dispatch(addEntity({ key: 'requests', entity: data }));
    })
    .on('update:Request', (data) => {
      dispatch(updateEntity({ key: 'requests', entity: data }));
    })
    .on('remove:Request', (data) => {
      dispatch(deleteEntity({ key: 'requests', id: data }));
    })

    /**
     * Appointment Socket
     */
    .on('create:Appointment', (data) => {
      dispatch(addEntity({ key: 'appointments', entity: data }));
    })
    .on('update:Appointment', (data) => {
      dispatch(updateEntity({ key: 'appointments', entity: data }));
    })
    .on('remove:Appointment', (data) => {
      dispatch(deleteEntity({ key: 'appointments', id: data }));
    })

    /**
     * Patient Socket
     */
    .on('create:Patient', (data) => {
      dispatch(addEntity({ key: 'appointments', entity: data }));
    })
    .on('update:Patient', (data) => {
      dispatch(updateEntity({ key: 'appointments', entity: data }));
    })
    .on('remove:Patient', (data) => {
      dispatch(deleteEntity({ key: 'appointments', id: data }));
    })
    .on('newMessage', (data) => {
      dispatch(receiveEntities({ key: 'chats', entities: data.entities }));
      const node = document.getElementById('careCruChatScrollIntoView');
      if (node) {
        node.scrollTop = node.scrollHeight - node.getBoundingClientRect().height;
      }
    })
    .on('syncClientError', (data) => {
      console.log('[ TEMP ] normalized logEntry', data);
    });
}

