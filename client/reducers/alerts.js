
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

const uuid = require('uuid').v4;

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';
export const DELETE_ALERT = 'DELETE_ALERT';

const initialState = fromJS({
  time: 0,
  alertsStack: [],
});

export default handleActions({
  [SHOW_ALERT](state, { payload: { alert, type } }) {
    let title = alert.title;
    if (type === 'success') {
      title = 'Success';
    } else if (type === 'error' && !alert.title) {
      title = 'Error';
    }
    const alertsStack = state.toJS().alertsStack;

    const time = alert.sticky ? state.toJS().time : state.toJS().time + 3000;

    const alertData = {
      id: alert.id || uuid(),
      title,
      body: alert.body,
      type,
      status: 'show',
      time,
      sticky: alert.sticky || false,
    };

    alertsStack.push(alertData);
    return state.merge({ time, alertsStack });
  },

  [DELETE_ALERT](state, payload) {
    const alertsStack = state.toJS().alertsStack;
    const time = state.toJS().time;
    const newAlertsStack = alertsStack.filter(alert => alert.id !== payload.payload);

    return state.merge({ time, alertsStack: newAlertsStack });
  },

  [HIDE_ALERT](state, action) {
    const alertsStack = state.toJS().alertsStack;

    const filteredStack = alertsStack.filter((alert, index) => {
      if ((index !== action.payload.index || alert.sticky) && (alert.id !== action.payload.id)) {
        return alert;
      }
    });

    const time = state.toJS().time !== 0 ? state.toJS().time - 3000 : 0;
    return state.merge({
      time,
      alertsStack: filteredStack,
    });
  },
}, initialState);
