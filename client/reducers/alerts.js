
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import Alert from '../entities/models/Alert';

const uuid = require('uuid').v4;

/**
 * Constants
 */
export const CREATE_ALERT = 'SHOW_ALERT';
export const REMOVE_ALERT = 'HIDE_ALERT';

/**
 * Initial State
 */
const initialState = Map({});

export default handleActions({
  [CREATE_ALERT](state, { payload: { alert, type } }) {
    let title = alert.title;

    if (type === 'success') {
      title = 'Success';
    } else if (type === 'error' && !alert.title) {
      title = 'Error';
    }

    const id = uuid();
    const alertData = new Alert({
      id,
      title,
      body: alert.body,
      type,
      status: 'show',
      time: 3000,
      sticky: alert.sticky || false,
      action: alert.action,
    });

    return state.set(id, alertData);
  },

  [REMOVE_ALERT](state, { payload: { alert } }) {
    return state.delete(alert.get('id'));
  },
}, initialState);
