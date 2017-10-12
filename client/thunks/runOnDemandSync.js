
import { showAlertTimeout } from '../thunks/alerts';
import axios from 'axios';
import { receiveEntities } from '../actions/entities';

export function runOnDemandSync() {
  return (dispatch, getState) => {
    // const confirmSync = confirm('Would you like to sync with the PMS?');
    // TODO: loading symbol dispatches etc. would be good!

    const alert = {
      success: {
        body: 'Syncing with PMS',
      },

      error: {
        body: 'Sync Failed',
      },
    };

    const url = '/api/syncClientControl/runSync';
    return axios.post(url, {})
      .then((result) => {
        dispatch(showAlertTimeout({ alert: alert.success, type: 'success' }));
        dispatch(receiveEntities({ entities: result.entities }));
      });
  };
}
