import jwt from 'jwt-decode';
import {
  addSocketEntity,
  addEntity,
  updateEntity,
  deleteEntity,
  receiveEntities,
} from '../actions/entities';

import {
  showAlertTimeout
} from '../thunks/alerts';


export default function connectSocketToStoreLogin(store, socket) {
  const jwtToken = localStorage.getItem('token');
  const { dispatch, getState } = store;

  socket
    .emit('authenticate', { token: jwtToken })
    .on('authenticated', () => {
      console.log('client/socket/connectSocketToStoreLogin.js: Socket connected and authenticated');

      /**
       * Request Socket
       */
      socket.on('create:Request', (data) => {
        dispatch(addEntity({ key: 'requests', entity: data }));
      });
      socket.on('update:Request', (data) => {
        dispatch(updateEntity({ key: 'requests', entity: data }));
      });
      socket.on('remove:Request', (data) => {
        dispatch(deleteEntity({ key: 'requests', id: data }));
      });

      /**
       * WaitSpot Socket
       */
      socket.on('create:WaitSpot', (data) => {
        dispatch(addEntity({ key: 'waitSpots', entity: data }));
      });
      socket.on('update:WaitSpot', (data) => {
        dispatch(updateEntity({ key: 'waitSpots', entity: data }));
      });
      socket.on('remove:WaitSpot', (data) => {
        dispatch(deleteEntity({ key: 'waitSpots', id: data }));
      });

      /**
       * Appointment Socket
       */
      socket.on('create:Appointment', (data) => {
        dispatch(addEntity({ key: 'appointments', entity: data }));
      });
      socket.on('update:Appointment', (data) => {
        dispatch(updateEntity({ key: 'appointments', entity: data }));
      });
      socket.on('remove:Appointment', (data) => {
        dispatch(deleteEntity({ key: 'appointments', id: data }));
      });

      /**
       * Patient Socket
       */
      socket.on('create:Patient', (data) => {
        dispatch(addEntity({ key: 'appointments', entity: data }));
      });
      socket.on('update:Patient', (data) => {
        dispatch(updateEntity({ key: 'appointments', entity: data }));
      });
      socket.on('remove:Patient', (data) => {
        dispatch(deleteEntity({ key: 'appointments', id: data }));
      });

      socket.on('newMessage', (data) => {
        dispatch(receiveEntities({ key: 'chats', entities: data.entities }));
        const node = document.getElementById('careCruChatScrollIntoView');
        if (node) {
          node.scrollTop = node.scrollHeight - node.getBoundingClientRect().height;
        }
      });

      socket.on('syncClientError', (data) => {
        const {
          model,
          operation,
        } = data;
        const text = `SyncClientError: ${model} ${operation} failed in the PMS`
        dispatch(showAlertTimeout({ text, type: 'error' }));

        console.log('[ TEMP ] normalized logEntry', data);
      });
    })
    .on('unauthorized', (msg) => {
      console.log('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    })

}

