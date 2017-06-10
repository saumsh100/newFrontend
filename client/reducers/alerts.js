
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

// TODO: Use Immutable!
// TODO: intitalValues are always null if no default provided
const initialState = {
  text: '',
  icon: '',
  type: '',
  status: 'hidden',
};

export default handleActions({
  [SHOW_ALERT](state, action) {
    return {
      ...state,
      ...action.alert,
      status: 'show',
    };
  },

  [HIDE_ALERT](state, action) {
    return {
      ...state,
      ...action.alert,
      status: 'hide',
    };
  },
}, initialState);
