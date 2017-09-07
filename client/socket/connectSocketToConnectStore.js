
import { updateEntity } from '../actions/entities';
import { setIsSyncing, setProgress } from '../reducers/connect';

export default function connectSocketToStoreLogin(store, socket) {
  const jwtToken = localStorage.getItem('token');
  const { dispatch, getState } = store;

  socket
    .emit('authenticate', { token: jwtToken })
    .on('authenticated', () => {
      socket.on('syncClientError', (data) => {
        console.log('Sync Client Error', data);
      });

      socket.on('syncFinished', (data) => {
        dispatch(setIsSyncing(false));
        dispatch(updateEntity({ key: 'accounts', entity: data }));
      });

      socket.on('syncProgress', (data) => {
        dispatch(setProgress(data));
      });
    })
    .on('unauthorized', (msg) => {
      console.log('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
}

