import { createAction } from 'redux-actions';
import {
	SET_SELECTED_PATIENT_ID,
  SEARCH_PATIENT,
	UPDATE_EDITING_PATIENT_STATE,
	CHANGE_PATIENT_INFO,
} from '../constants';

export const setSelectedPatientIdAction = createAction(SET_SELECTED_PATIENT_ID);
export const updateEditingPatientStateAction = createAction(UPDATE_EDITING_PATIENT_STATE);
export const searchPatientAction = createAction(SEARCH_PATIENT);
