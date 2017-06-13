
import { receiveEntities } from '../actions/entities';
import axios from './axios';

export default function runOnDemandSync() {
  return (getState, dispatch) => {
    // const confirmSync = confirm('Would you like to sync with the PMS?');
    // TODO: loading symbol dispatches etc. would be good!

    console.log('1Running on demand sync...');
    // createEntityRequest({ url: '/api/syncClientError/runSync' });
    const url = '/api/syncClientError/runSync';
    return axios.post(url, null)
      .then((result) => {
        dispatch(receiveEntities({ entities: result.entities }));
      });
  };
}
