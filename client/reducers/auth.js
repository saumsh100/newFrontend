
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
  [LOGIN_SUCCESS](state, action) {
    return state.merge({
      token: action.payload,
      isAuthenticated: true,
    });
  },

  [LOGOUT]() {
    return initialState;
  },
}, initialState);
