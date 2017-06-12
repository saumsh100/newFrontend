
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

const initialState = fromJS ({
  text: null,
  icon: null,
  type: null,
  status: null,
});

export default handleActions({
  [SHOW_ALERT](state, { payload: { text, type } }) {
    return state.merge({
      text,
      type,
      status: 'show',
    })
  },

  [HIDE_ALERT](state) {
    return state.merge({
      text: null,
      icon: null,
      type: null,
      status: 'hide',
    });
  },
}, initialState);
