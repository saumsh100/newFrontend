
import axios from 'axios';
import { showAlertTimeout } from '../thunks/alerts';
import { receiveEntities } from '../reducers/entities';

const alert = {
  success: { body: 'Syncing with PMS' },
  error: { body: 'Sync Failed' },
};

export default () => dispatch =>
  axios
    .post('/api/syncClientControl/runSync')
    .then(({ entities }) => {
      dispatch(showAlertTimeout({
        alert: alert.success,
        type: 'success',
      }));
      dispatch(receiveEntities({ entities }));
    })
    .catch((err) => {
      dispatch(showAlertTimeout({
        alert: alert.error,
        type: 'error',
      }));
      throw err;
    });
