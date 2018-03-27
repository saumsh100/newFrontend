
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LOGIN_SUCCESS,
  LOGOUT,
} from '../constants';

const initialState = fromJS({
  isAuthenticated: false,
  forgotPassword: false,
  role: null,
  accountId: null,
  enterprise: null,
  user: null,
  sessionId: null,
  flags: {},
});

export default handleActions({
  [LOGIN_SUCCESS](state, { payload }) {
    return state.merge({
      ...payload,
      isAuthenticated: true,
    });
  },

  [LOGOUT]() {
    return initialState;
  },

}, initialState);
