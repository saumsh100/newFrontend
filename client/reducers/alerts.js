
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

const initialState = fromJS({
  body: null,
  icon: null,
  title: null,
  type: null,
  status: null,
});

export default handleActions({
  [SHOW_ALERT](state, { payload: { alert, type } }) {
    let title = alert.title;
    if (type === 'success') {
      title = 'Success';
    } else if (type === 'error' && !alert.title) {
      title = 'Error';
    }

    return state.merge({
      title,
      body: alert.body,
      type,
      status: 'show',
    });
  },

  [HIDE_ALERT](state) {
    return state.merge({
      body: null,
      title: null,
      icon: null,
      type: null,
      status: 'hide',
    });
  },
}, initialState);
