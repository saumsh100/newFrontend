import { createAction } from 'redux-actions';
import {
	SET_CURRENT_PATIENT,
	SET_PATIENTS_FILTER,
} from '../constants';

export const setCurrentPatientAction = createAction(SET_CURRENT_PATIENT);
export const setPatientsFilterAction = createAction(SET_PATIENTS_FILTER);
