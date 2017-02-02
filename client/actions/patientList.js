import { createAction } from 'redux-actions';
import {
	SET_CURRENT_PATIENT,
	UPDATE_EDITING_PATIENT_STATE,
} from '../constants';

export const setCurrentPatientAction = createAction(SET_CURRENT_PATIENT);
export const updateEditingPatientStateAction = createAction(UPDATE_EDITING_PATIENT_STATE);
