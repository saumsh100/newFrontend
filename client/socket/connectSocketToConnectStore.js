
import { push } from 'connected-react-router';
import { updateEntity } from '../reducers/entities';
import { setIsSyncing, setProgress, setIsDone } from '../reducers/connect';

export default function connectSocketToConnectStore(store, socket) {
  const jwtToken = localStorage.getItem('token');
  const { dispatch } = store;

  window.setProgress = (data) => {
    dispatch(setProgress(data));
  };

  window.setFinished = () => {
    dispatch(setIsSyncing(false));
    dispatch(setIsDone(true));
    setTimeout(() => {
      dispatch(push('./completed'));
    }, 500);
  };

  console.log('Connected to socket');

  socket
    .emit('authenticate', { token: jwtToken })
    .on('authenticated', () => {
      socket.on('syncClientError', (data) => {
        console.log('Sync Client Error', data);
      });

      socket.on('syncFinished', (data) => {
        console.log('finished', data);
        dispatch(setIsSyncing(false));
        dispatch(setIsDone(true));
        setTimeout(() => {
          dispatch(push('./completed'));
        }, 500);

        dispatch(updateEntity({
          key: 'accounts',
          entity: data,
        }));
      });

      socket.on('syncProgress', (data) => {
        console.log('progress', data);
        dispatch(setProgress(data));
      });
    })
    .on('unauthorized', (msg) => {
      console.log('unauthorized: ', JSON.stringify(msg.data));
      throw new Error(msg.data.type);
    });
}
