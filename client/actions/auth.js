
import { createAction } from 'redux-actions';
import { LOGIN_SUCCESS, LOGOUT, SET_RESET_EMAIL, SET_FAMILY_PATIENTS } from '../constants';

export const loginSuccess = createAction(LOGIN_SUCCESS);
export const logout = createAction(LOGOUT);
export const setResetEmail = createAction(SET_RESET_EMAIL);
export const setFamilyPatients = createAction(SET_FAMILY_PATIENTS);
