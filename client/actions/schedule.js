
import { createAction } from 'redux-actions';
import {
	ADD_PRACTITIONER,
	REMOVE_PRACTITIONER,
} from '../constants';

export const addPractitionerFilter = createAction(ADD_PRACTITIONER);
export const removePractitionerFilter = createAction(REMOVE_PRACTITIONER);