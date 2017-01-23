
import { createAction } from 'redux-actions';
import {
	ADD_PRACTITIONER,
	REMOVE_PRACTITIONER,
	SELECT_APPOINMENT_TYPE,
} from '../constants';

export const addPractitionerFilter = createAction(ADD_PRACTITIONER);
export const removePractitionerFilter = createAction(REMOVE_PRACTITIONER);
export const selectAppointmentTypeFilter = createAction(SELECT_APPOINMENT_TYPE);