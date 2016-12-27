
import { createAction } from 'redux-actions';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USERNAME,
  SET_PASSWORD,
} from '../constants';

export const login = createAction(LOGIN);
export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
export const setUsername = createAction(SET_USERNAME);
export const setPassword = createAction(SET_PASSWORD);
