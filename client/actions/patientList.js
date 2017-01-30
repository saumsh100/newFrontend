import { createAction } from 'redux-actions';
import {
	SET_CURRENT_PATIENT,
} from '../constants';

export const setCurrentPatientAction = createAction(SET_CURRENT_PATIENT);
