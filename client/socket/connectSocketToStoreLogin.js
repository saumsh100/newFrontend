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

import {
  setSyncingWithPMS,
} from '../actions/schedule';

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
        dispatch(receiveEntities({ key: 'requests', entities: data.entities }));
      });
      socket.on('update:Request', (data) => {
        dispatch(receiveEntities({ key: 'requests', entities: data.entities }));
      });
      socket.on('remove:Request', (data) => {
        dispatch(deleteEntity({ key: 'requests', id: data }));
      });

      /**
       * WaitSpot Socket
       */
      socket.on('create:WaitSpot', (data) => {
        console.log(data)
        dispatch(receiveEntities({ key: 'waitSpots', entities: data.entities }));
      });
      socket.on('update:WaitSpot', (data) => {
        dispatch(receiveEntities({ key: 'waitSpots', entities: data.entities }));
      });
      socket.on('remove:WaitSpot', (data) => {
        dispatch(deleteEntity({ key: 'waitSpots', id: data }));
      });

      /**
       * SentReminder Socket
       */
      socket.on('create:SentReminder', (data) => {
        dispatch(receiveEntities({ key: 'sentReminders', entities: data.entities }));
      });
      socket.on('update:SentReminder', (data) => {
        dispatch(receiveEntities({ key: 'sentReminders', entities: data.entities }));
      });
      socket.on('remove:SentReminder', (data) => {
        dispatch(deleteEntity({ key: 'sentReminders', id: data }));
      });

      /**
       * SentRecalls Socket
       */
      socket.on('create:SentRecall', (data) => {
        dispatch(receiveEntities({ key: 'sentRecalls', entities: data.entities }));
      });
      socket.on('update:SentRecall', (data) => {
        dispatch(receiveEntities({ key: 'sentRecalls', entities: data.entities }));
      });
      socket.on('remove:SentRecall', (data) => {
        dispatch(deleteEntity({ key: 'sentRecalls', id: data }));
      });

      /**
       * Appointment Socket
       */
      socket.on('create:Appointment', (data) => {
        dispatch(receiveEntities({ key: 'appointments', entities: data.entities }));
      });
      socket.on('update:Appointment', (data) => {
        dispatch(receiveEntities({ key: 'appointments', entities: data.entities }));
      });
      socket.on('remove:Appointment', (data) => {
        console.log('remove:Appointment event, id=', data.id);
        dispatch(deleteEntity({ key: 'appointments', id: data.id }));
      });

      /**
       * Patient Socket
       */
      socket.on('create:Patient', (data) => {
        console.log('Created Patient', data.entities);
        dispatch(receiveEntities({ key: 'patients', entities: data.entities }));
      });

      socket.on('update:Patient', (data) => {
        dispatch(receiveEntities({ key: 'patients', entities: data.entities }));
      });
      socket.on('remove:Patient', (data) => {
        dispatch(deleteEntity({ key: 'patients', id: data.id }));
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
        const alert = {
          title: 'Sync Error',
          body: `SyncClientError: ${model} ${operation} failed in the PMS`,
        };
        dispatch(showAlertTimeout({ alert, type: 'error' }));
      });

      socket.on('syncFinished', () => {
        const alert = {
          title: 'Sync update',
          body: 'Sync finished',
        };
        // console.log(alert.body);
        dispatch(showAlertTimeout({ alert, type: 'success' }));
        dispatch(setSyncingWithPMS({ isSyncing: false }));
      });

      socket.on('syncProgress', (data) => {
        const percentDone = Math.floor((data.saved / data.total) * 100);
        const alert = {
          title: 'Sync progress',
          body: `${data.collection} ${percentDone}%`,
        };
        console.log(alert.body);
        dispatch(showAlertTimeout({ alert, type: 'success' }));
      });
    })
    .on('unauthorized', (msg) => {
      console.log('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });

}

