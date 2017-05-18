import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LOGIN_SUCCESS,
  LOGOUT,
} from '../constants';

const initialState = fromJS({
  token: null,
  isAuthenticated: false,
  role: null,
});

export default handleActions({
  [LOGIN_SUCCESS](state, { payload: { token, role } }) {
    return state.merge({
      token,
      isAuthenticated: true,
      role,
    });
  },

  [LOGOUT]() {
    return initialState;
  },
}, initialState);
