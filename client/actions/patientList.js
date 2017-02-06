import { createAction } from 'redux-actions';
import {
	SET_CURRENT_PATIENT,
	UPDATE_EDITING_PATIENT_STATE,
	CHANGE_PATIENT_INFO,
} from '../constants';

export const setCurrentPatientAction = createAction(SET_CURRENT_PATIENT);
export const updateEditingPatientStateAction = createAction(UPDATE_EDITING_PATIENT_STATE);
export const changePatientInfoAction = createAction(CHANGE_PATIENT_INFO);
