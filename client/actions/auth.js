
import { createAction } from 'redux-actions';
import { SET_RESET_EMAIL, SET_FAMILY_PATIENTS } from '../constants';

export const setResetEmail = createAction(SET_RESET_EMAIL);
export const setFamilyPatients = createAction(SET_FAMILY_PATIENTS);
