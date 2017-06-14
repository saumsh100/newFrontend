
import { receiveEntities } from '../actions/entities';
import axios from './axios';

export default function runOnDemandSync() {
  return (getState, dispatch) => {
    // const confirmSync = confirm('Would you like to sync with the PMS?');
    // TODO: loading symbol dispatches etc. would be good!

    const url = '/api/syncClientControl/runSync';
    return axios.post(url, null)
      .then((result) => {
        dispatch(receiveEntities({ entities: result.entities }));
      });
  };
}
