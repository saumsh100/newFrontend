import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  LOGIN_SUCCESS,
  LOGOUT,
} from '../constants';
import LogRocket from 'logrocket';
import socket from '../socket';
import connectSocketToStoreLogin from '../socket/connectSocketToStoreLogin';

const initialState = fromJS({
  isAuthenticated: false,
  role: null,
  accountId: null,
  user: null,
  tokenId: null,
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
