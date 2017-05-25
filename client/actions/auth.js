
import { createAction } from 'redux-actions';
import {
  LOGIN_SUCCESS,
  LOGOUT,
} from '../constants';

export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
