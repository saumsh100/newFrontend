import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LOGIN_SUCCESS,
  LOGOUT,
} from '../constants';

const initialState = fromJS({
  token: null,
  isAuthenticated: false,
});

export default handleActions({
  [LOGIN_SUCCESS](state, { token }) {
    return state.merge({
      token,
      isAuthenticated: true,
    });
  },

  [LOGOUT]() {
    return initialState;
  },
}, initialState);
