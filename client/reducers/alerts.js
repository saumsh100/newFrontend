
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

const uuid = require('uuid').v4;

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

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
      action: alert.action,
    };

    alertsStack.push(alertData);
    return state.merge({ time, alertsStack });
  },

  [HIDE_ALERT](state, { payload: { alert } }) {
    const alertsStack = state.toJS().alertsStack;

    const filteredStack = alertsStack.filter((alrt) => {
      if (alrt.id !== alert.id) {
        return alrt;
      }
    });

    const time = state.toJS().time !== 0 ? state.toJS().time - 3000 : 0;
    return state.merge({
      time,
      alertsStack: filteredStack,
    });
  },
}, initialState);
