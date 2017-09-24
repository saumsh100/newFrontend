
import axios from 'axios';
import {
  setIsSyncing,
  setProgress,
} from '../reducers/connect';
import {
  updateEntityRequest,
} from '../thunks/fetchEntities';

/**
 * startSync will kickstart the sync progress
 *
 * @returns {Function}
 */
export function startSync() {
  return (dispatch, getState) => {
    //const { entities, auth } = getState();
    //const account = entities.getIn(['accounts', 'models', auth.get('accountId')]);
    //const newAccount = account.merge({ syncEnabled: true });

    const body = {
      name: 'CONNECTOR_ENABLED',
      value: '1',
    };

    const config = {
      headers: {
        'Accept': 'application/vnd.api+json',
      },
    };

    // TODO: what this needs to do is update account.syncEnabled
    return axios.put('/api/accounts/configurations', body, config)
      .then(() => {
        dispatch(setIsSyncing(true));
      });
  };
}

/**
 * stopSync will stop the sync progress
 *
 * @returns {Function}
 */
export function stopSync() {
  return function (dispatch, getState) {
    // This can't really do much right now...
    dispatch(setIsSyncing(false));
  };
}
