
import axios from 'axios';
import {
  setIsSyncing,
  setProgress,
} from '../reducers/connect';

/**
 * startSync will kickstart the sync progress
 *
 * @returns {Function}
 */
export function startSync() {
  return (dispatch) => {
    const url = '/api/syncClientControl/runSync';
    return axios.post(url, {})
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
