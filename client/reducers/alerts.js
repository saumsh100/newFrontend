
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import Alert from '../entities/models/Alert';

const uuid = require('uuid').v4;

/**
 * Constants
 */
export const CREATE_ALERT = 'CREATE_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';

/**
 * Initial State
 */
const initialState = Map({});

export default handleActions({
  [CREATE_ALERT](state, { payload: { alert, type } }) {
    let title = alert.title;

    if (!alert.title && type === 'success') {
      title = 'Success';
    } else if (type === 'error' && !alert.title) {
      title = 'Error';
    }

    const id = alert.id || uuid();
    const alertData = new Alert({
      id,
      title,
      body: alert.body,
      type,
      caller: alert.caller || false,
      time: 3000,
      sticky: alert.sticky || false,
      browserAlert: alert.browserAlert || false,
    });

    return state.set(id, alertData);
  },

  [REMOVE_ALERT](state, { payload: { alert } }) {
    return state.delete(alert.id);
  },
}, initialState);
