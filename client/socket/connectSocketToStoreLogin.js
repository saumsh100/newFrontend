
import { push } from 'connected-react-router';
import { updateEntity, deleteEntity, receiveEntities } from '../reducers/entities';
import { setSyncingWithPMS } from '../actions/schedule';
import {
  addMessage,
  createListOfUnreadedChats,
  getChatCategoryCounts,
  loadUnreadChatCount,
  socketLock,
} from '../thunks/chat';
import { fetchWaitingRoomQueue } from '../thunks/waitingRoom';
import { isHub } from '../util/hub';
import DesktopNotification from '../util/desktopNotification';

export default function connectSocketToStoreLogin(store, socket) {
  const jwtToken = localStorage.getItem('token');
  const { dispatch } = store;

  socket
    .emit('authenticate', { token: jwtToken })
    .on('authenticated', () => {
      console.log('client/socket/connectSocketToStoreLogin.js: Socket connected and authenticated');

      socket.on('PatientEnteredWaitingRoom', ({ patient, waitingRoomPatient }) => {
        DesktopNotification.showNotification('Patient has entered waiting room', {
          body: `${patient.firstName} ${patient.lastName} has entered the virtual waiting room.`,
          onClick: () => {
            dispatch(push('/'));
          },
        });

        dispatch(fetchWaitingRoomQueue({ accountId: waitingRoomPatient.accountId }));
      });

      socket.on('WaitingRoomHasChanged', ({ waitingRoomPatient }) => {
        dispatch(fetchWaitingRoomQueue({ accountId: waitingRoomPatient.accountId }));
      });

      /**
       * Request Socket
       */
      socket.on('request.created', (data) => {
        dispatch(
          receiveEntities({
            key: 'requests',
            entities: data.entities,
          }),
        );
        const alert = {
          title: 'Appointment Request',
          body: 'You have an appointment request.',
          browserAlert: true,
        };

        DesktopNotification.showNotification(alert.title, {
          body: alert.body,
          onClick: () => {
            if (isHub()) {
              import('../thunks/electron').then((electronThunk) => {
                store.getState().router.location.pathname.indexOf('/requests') === -1
                  && dispatch(push('/requests'));
                dispatch(electronThunk.displayContent());
              });
              return;
            }
            dispatch(push(`/schedule?selectedRequest=${data.result}`));
          },
        });
      });

      socket.on('update:Request', (data) => {
        dispatch(
          receiveEntities({
            key: 'requests',
            entities: data.entities,
          }),
        );
      });
      socket.on('remove:Request', (data) => {
        dispatch(
          deleteEntity({
            key: 'requests',
            id: data,
          }),
        );
      });

      /**
       * WaitSpot Socket
       */
      socket.on('create:WaitSpot', (data) => {
        dispatch(
          receiveEntities({
            key: 'waitSpots',
            entities: data.entities,
          }),
        );
      });
      socket.on('update:WaitSpot', (data) => {
        dispatch(
          receiveEntities({
            key: 'waitSpots',
            entities: data.entities,
          }),
        );
      });
      socket.on('remove:WaitSpot', (data) => {
        dispatch(
          deleteEntity({
            key: 'waitSpots',
            id: data,
          }),
        );
      });

      /**
       * SentReminder Socket
       */
      socket.on('create:SentReminder', (data) => {
        dispatch(
          receiveEntities({
            key: 'sentReminders',
            entities: data.entities,
          }),
        );
      });
      socket.on('update:SentReminder', (data) => {
        dispatch(
          receiveEntities({
            key: 'sentReminders',
            entities: data.entities,
          }),
        );
      });
      socket.on('remove:SentReminder', (data) => {
        dispatch(
          deleteEntity({
            key: 'sentReminders',
            id: data,
          }),
        );
      });

      /**
       * SentRecalls Socket
       */
      socket.on('create:SentRecall', (data) => {
        dispatch(
          receiveEntities({
            key: 'sentRecalls',
            entities: data.entities,
          }),
        );
      });
      socket.on('update:SentRecall', (data) => {
        dispatch(
          receiveEntities({
            key: 'sentRecalls',
            entities: data.entities,
          }),
        );
      });
      socket.on('remove:SentRecall', (data) => {
        dispatch(
          deleteEntity({
            key: 'sentRecalls',
            id: data,
          }),
        );
      });

      /**
       * Appointment Socket
       */
      socket.on('create:Appointment', (data) => {
        dispatch(
          receiveEntities({
            key: 'appointments',
            entities: data.entities,
          }),
        );
      });
      socket.on('update:Appointment', (data) => {
        dispatch(
          receiveEntities({
            key: 'appointments',
            entities: data.entities,
          }),
        );
      });
      socket.on('remove:Appointment', (data) => {
        // console.log('remove:Appointment event, id=', data.id);
        dispatch(
          deleteEntity({
            key: 'appointments',
            id: data.id,
          }),
        );
      });

      /**
       * Calls Socket
       */
      socket.on('call.started', (data) => {
        /* const callId = Object.keys(data.entities.calls)[0];
        const patientId = data.entities.patients ? Object.keys(data.entities.patients)[0] : null;
        const patient = patientId
          ? `${data.entities.patients[patientId].firstName} ${
            data.entities.patients[patientId].lastName
          }`
          : 'Unknown';
        const alert = {
          id: callId,
          title: 'Incoming Call',
          caller: true,
          body: `${patient}`,
          subText: `${formatPhoneNumber(data.entities.calls[callId].callerNum)}`,
          sticky: true,
          browserAlert: true,
          clickable: true,
        }; */

        dispatch(
          receiveEntities({
            key: 'calls',
            entities: data.entities,
          }),
        );
        // dispatch(showAlertTimeout({ alert, type: 'success' }));
      });

      socket.on('call.ended', (data) => {
        // const callId = Object.keys(data.entities.calls)[0];
        dispatch(
          receiveEntities({
            key: 'calls',
            entities: data.entities,
          }),
        );
        // dispatch(removeAlert({ alert: { id: callId } }));
      });

      /**
       * Patient Socket
       */
      socket.on('create:Patient', (data) => {
        // console.log('Created Patient', data.entities);
        dispatch(
          receiveEntities({
            key: 'patients',
            entities: data.entities,
          }),
        );
      });

      socket.on('update:Patient', (data) => {
        dispatch(
          receiveEntities({
            key: 'patients',
            entities: data.entities,
          }),
        );
      });
      socket.on('remove:Patient', (data) => {
        dispatch(
          deleteEntity({
            key: 'patients',
            id: data.id,
          }),
        );
      });

      socket.on('create:TextMessage', (data) => {
        dispatch(
          receiveEntities({
            key: 'chats',
            entities: data.entities,
          }),
        );
        dispatch(loadUnreadChatCount()).then(() => {
          dispatch(getChatCategoryCounts());
          dispatch(addMessage(data));
        });

        const node = document.getElementById('careCruChatScrollIntoView');
        if (node) {
          node.scrollTop = node.scrollHeight - node.getBoundingClientRect().height;
        }
      });

      socket.on('unread:TextMessage', (data) => {
        dispatch(loadUnreadChatCount()).then(() => {
          dispatch(socketLock(data.entities.textMessages));
          dispatch(getChatCategoryCounts());
        });
      });

      socket.on('read:TextMessage', (data) => {
        dispatch(
          receiveEntities({
            key: 'textMessages',
            entities: data.entities,
          }),
        );
        dispatch(loadUnreadChatCount()).then(() => {
          dispatch(getChatCategoryCounts());
          dispatch(createListOfUnreadedChats(data.entities.textMessages));
        });
      });

      socket.on('update:Chat', (data) => {
        dispatch(
          receiveEntities({
            key: 'chat',
            entities: data.entities,
          }),
        );
      });

      socket.on('syncClientError', () => {});

      socket.on('syncFinished', (data) => {
        dispatch(setSyncingWithPMS({ isSyncing: false }));
        dispatch(
          updateEntity({
            key: 'accounts',
            entity: data,
          }),
        );
      });

      socket.on('syncProgress', () => {});
    })
    .on('unauthorized', (msg) => {
      console.log('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
}
