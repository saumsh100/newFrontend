
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

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

    const alertData = {
      title,
      body: alert.body,
      type,
      status: 'show',
      time: state.toJS().time + 3000,
    };

    alertsStack.push(alertData);
    return state.merge({ ...alertData, alertsStack });
  },

  [HIDE_ALERT](state, action) {
    const alertsStack = state.toJS().alertsStack;
    const filteredStack = alertsStack.filter((alert, i) => i !== action.payload.index);

    console.log("index===>", action.payload.index, "time==>", state.toJS().time);

    const time = state.toJS().time !== 0 ? state.toJS().time - 3000 : 0;
    return state.merge({
      time,
      alertsStack: filteredStack,
    });
  },
}, initialState);
